import crypto from "crypto";
import { getCourseById, listAvailableCourses } from "../constants/courses.js";
import {
  CIPHERBC_STATUS_MAP,
  FINAL_PAYMENT_STATUSES,
  type PaymentStatus,
} from "../constants/payments.js";
import { Payment, type PaymentDocument, type PaymentRecord } from "../models/Payment.js";
import { PaymentEvent } from "../models/PaymentEvent.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta, toClient } from "../utils/serialize.js";
import type { AdminPaymentUpdate, CreatePaymentInput, PaymentListQuery } from "../validators/payment.validator.js";
import {
  buildCallbackAcknowledgement,
  createH5DepositOrder,
  generateMerchantOrderId,
  getH5OrderDetail,
  hashCallbackPayload,
  verifyCallbackSignature,
} from "./cipherbc.client.js";
import { getCipherBcConfig } from "../config/cipherbc.js";

const STATUS_PRIORITY: Record<PaymentStatus, number> = {
  pending: 0,
  failed: 1,
  cancelled: 2,
  abnormal: 3,
  overpayment: 4,
  completed: 5,
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mapCipherBcPayments(
  payments: Array<Record<string, unknown>> | undefined
): PaymentRecord[] {
  if (!Array.isArray(payments)) {
    return [];
  }

  return payments.map((payment) => ({
    coin: String(payment.coin ?? ""),
    address: String(payment.address ?? ""),
    txid: String(payment.txid ?? ""),
    amount: String(payment.amount ?? ""),
    confirmTime:
      typeof payment.confirm_time === "number"
        ? payment.confirm_time
        : typeof payment.confirmTime === "number"
          ? payment.confirmTime
          : undefined,
    status: typeof payment.status === "number" ? payment.status : undefined,
    checkStatus:
      typeof payment.check_status === "number"
        ? payment.check_status
        : typeof payment.checkStatus === "number"
          ? payment.checkStatus
          : undefined,
    checkCode:
      typeof payment.check_code === "number"
        ? payment.check_code
        : typeof payment.checkCode === "number"
          ? payment.checkCode
          : undefined,
  }));
}

function totalPaidAmount(payments: PaymentRecord[]) {
  if (payments.length === 0) {
    return undefined;
  }

  const total = payments.reduce((sum, payment) => sum + Number.parseFloat(payment.amount || "0"), 0);
  return Number.isFinite(total) ? String(total) : undefined;
}

function shouldApplyStatus(current: PaymentStatus, next: PaymentStatus) {
  if (current === next) {
    return false;
  }

  if (FINAL_PAYMENT_STATUSES.includes(current)) {
    return STATUS_PRIORITY[next] > STATUS_PRIORITY[current];
  }

  return true;
}

async function recordPaymentEvent(input: {
  paymentId?: string;
  merchantOrderId?: string;
  cipherbcOrderNo?: string;
  eventType: "created" | "callback_received" | "status_sync" | "admin_update" | "signature_failed";
  signatureValid?: boolean;
  sourceIp?: string;
  payload: Record<string, unknown>;
}) {
  await PaymentEvent.create({
    paymentId: input.paymentId,
    merchantOrderId: input.merchantOrderId,
    cipherbcOrderNo: input.cipherbcOrderNo,
    eventType: input.eventType,
    signatureValid: input.signatureValid,
    sourceIp: input.sourceIp,
    payload: input.payload,
  });
}

async function grantCourseAccess(userId: string, courseId: string) {
  await User.updateOne({ _id: userId }, { $addToSet: { purchasedCourses: courseId } });
}

export function listCourses() {
  return listAvailableCourses();
}

export async function createPaymentOrder(
  input: CreatePaymentInput,
  meta: { userId: string; ip?: string; userAgent?: string }
) {
  const course = getCourseById(input.courseId);
  if (!course || !course.available) {
    throw ApiError.notFound("Course not available for purchase");
  }

  const user = await User.findById(meta.userId).lean();
  if (!user || user.status !== "active") {
    throw ApiError.unauthorized("Account is not available");
  }

  const existingPurchase = await Payment.findOne({
    userId: meta.userId,
    courseId: course.id,
    status: { $in: ["completed", "overpayment"] },
    isDeleted: false,
  }).lean();

  if (existingPurchase) {
    throw ApiError.conflict("You already purchased this course");
  }

  const pendingOrder = await Payment.findOne({
    userId: meta.userId,
    courseId: course.id,
    status: "pending",
    isDeleted: false,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (pendingOrder?.checkoutUrl) {
    return {
      paymentId: pendingOrder._id.toString(),
      merchantOrderId: pendingOrder.merchantOrderId,
      checkoutUrl: pendingOrder.checkoutUrl,
      amount: pendingOrder.amount,
      currency: pendingOrder.currency,
      status: pendingOrder.status,
    };
  }

  const config = getCipherBcConfig();
  const merchantOrderId = generateMerchantOrderId();
  const successUrl = `${config.websiteUrl}/payments/success?order=${merchantOrderId}`;
  const failUrl = `${config.websiteUrl}/payments/failed?order=${merchantOrderId}`;
  const returnUrl = `${config.websiteUrl}/payments/status/${merchantOrderId}`;

  const cipherbcOrder = await createH5DepositOrder({
    merchantOrderId,
    amount: course.amount,
    currency: course.currency,
    returnUrl,
    successUrl,
    failUrl,
  });

  const payment = await Payment.create({
    merchantOrderId,
    cipherbcOrderNo: cipherbcOrder.order_no,
    userId: meta.userId,
    userEmail: user.email,
    userName: user.name,
    courseId: course.id,
    courseTitle: course.title,
    amount: course.amount,
    currency: course.currency,
    status: CIPHERBC_STATUS_MAP[cipherbcOrder.status] ?? "pending",
    cipherbcStatus: cipherbcOrder.status,
    checkoutUrl: cipherbcOrder.checkout_url,
    returnUrl,
    successUrl,
    failUrl,
    addresses: cipherbcOrder.addresses ?? [],
    clientIp: meta.ip,
    userAgent: meta.userAgent,
    expiresAt: cipherbcOrder.expires_at ? new Date(cipherbcOrder.expires_at * 1000) : undefined,
  });

  await recordPaymentEvent({
    paymentId: payment._id.toString(),
    merchantOrderId,
    cipherbcOrderNo: cipherbcOrder.order_no,
    eventType: "created",
    sourceIp: meta.ip,
    payload: {
      amount: course.amount,
      currency: course.currency,
      courseId: course.id,
    },
  });

  return {
    paymentId: payment._id.toString(),
    merchantOrderId,
    checkoutUrl: cipherbcOrder.checkout_url,
    amount: course.amount,
    currency: course.currency,
    status: payment.status,
  };
}

async function applyOrderUpdate(
  payment: PaymentDocument,
  detail: {
    status: number;
    payments?: PaymentRecord[];
    addresses?: Array<{ coin: string; address: string; amount: string }>;
  },
  source: "callback_received" | "status_sync",
  meta?: { sourceIp?: string; signatureValid?: boolean; payload?: Record<string, unknown> }
) {
  const nextStatus = CIPHERBC_STATUS_MAP[detail.status] ?? payment.status;
  const mappedPayments = detail.payments ?? payment.payments;
  const update: Record<string, unknown> = {
    cipherbcStatus: detail.status,
    payments: mappedPayments,
    paidAmount: totalPaidAmount(mappedPayments) ?? payment.paidAmount,
  };

  if (detail.addresses?.length) {
    update.addresses = detail.addresses;
  }

  if (shouldApplyStatus(payment.status, nextStatus)) {
    update.status = nextStatus;

    if (nextStatus === "completed" || nextStatus === "overpayment") {
      update.completedAt = new Date();
      update.reviewStatus = "none";
      await grantCourseAccess(payment.userId.toString(), payment.courseId);
    }

    if (nextStatus === "abnormal") {
      update.reviewStatus = "pending_review";
    }
  }

  const updated = await Payment.findOneAndUpdate({ _id: payment._id }, update, { new: true }).lean();

  await recordPaymentEvent({
    paymentId: payment._id.toString(),
    merchantOrderId: payment.merchantOrderId,
    cipherbcOrderNo: payment.cipherbcOrderNo,
    eventType: source,
    signatureValid: meta?.signatureValid,
    sourceIp: meta?.sourceIp,
    payload: meta?.payload ?? { status: detail.status },
  });

  return updated;
}

export async function syncPaymentByMerchantOrderId(merchantOrderId: string, userId?: string) {
  const payment = await Payment.findOne({ merchantOrderId, isDeleted: false });
  if (!payment) {
    throw ApiError.notFound("Payment not found");
  }

  if (userId && payment.userId.toString() !== userId) {
    throw ApiError.forbidden("You do not have access to this payment");
  }

  if (!payment.cipherbcOrderNo) {
    return toClient(payment.toObject() as unknown as Record<string, unknown>);
  }

  const detail = await getH5OrderDetail(payment.cipherbcOrderNo);
  const updated = await applyOrderUpdate(
    payment,
    {
      status: detail.status,
      payments: mapCipherBcPayments(detail.payments as unknown as Array<Record<string, unknown>>),
      addresses: detail.addresses,
    },
    "status_sync",
    { payload: { orderNo: payment.cipherbcOrderNo } }
  );

  return toClient((updated ?? payment.toObject()) as unknown as Record<string, unknown>);
}

export async function handleCipherBcCallback(
  body: Record<string, unknown>,
  meta: { sourceIp?: string }
) {
  const signature = typeof body.sign === "string" ? body.sign : "";
  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as Record<string, unknown>)
      : null;

  if (!data) {
    await recordPaymentEvent({
      eventType: "signature_failed",
      sourceIp: meta.sourceIp,
      signatureValid: false,
      payload: { reason: "missing_data" },
    });
    throw ApiError.badRequest("Invalid callback payload");
  }

  const signatureValid = verifyCallbackSignature(data, signature);
  const callbackHash = hashCallbackPayload(data, signature);

  if (!signatureValid) {
    await recordPaymentEvent({
      merchantOrderId:
        typeof data.merchant_order_id === "string" ? data.merchant_order_id : undefined,
      cipherbcOrderNo: typeof data.order_no === "string" ? data.order_no : undefined,
      eventType: "signature_failed",
      sourceIp: meta.sourceIp,
      signatureValid: false,
      payload: data,
    });
    throw ApiError.forbidden("Callback signature verification failed");
  }

  const merchantOrderId =
    typeof data.merchant_order_id === "string" ? data.merchant_order_id : undefined;
  const orderNo = typeof data.order_no === "string" ? data.order_no : undefined;

  const payment = await Payment.findOne({
    isDeleted: false,
    $or: [
      ...(merchantOrderId ? [{ merchantOrderId }] : []),
      ...(orderNo ? [{ cipherbcOrderNo: orderNo }] : []),
    ],
  });

  if (!payment) {
    await recordPaymentEvent({
      merchantOrderId,
      cipherbcOrderNo: orderNo,
      eventType: "callback_received",
      sourceIp: meta.sourceIp,
      signatureValid: true,
      payload: { ...data, note: "payment_not_found" },
    });
    return buildCallbackAcknowledgement();
  }

  if (payment.processedCallbackHashes.includes(callbackHash)) {
    return buildCallbackAcknowledgement();
  }

  const cipherbcStatus = typeof data.status === "number" ? data.status : payment.cipherbcStatus;
  await Payment.updateOne({ _id: payment._id }, { $addToSet: { processedCallbackHashes: callbackHash } });

  await applyOrderUpdate(
    payment,
    {
      status: cipherbcStatus,
      payments: mapCipherBcPayments(
        data.payments as Array<Record<string, unknown>> | undefined
      ),
    },
    "callback_received",
    {
      sourceIp: meta.sourceIp,
      signatureValid: true,
      payload: data,
    }
  );

  return buildCallbackAcknowledgement();
}

export async function handleCipherBcWithdrawCallback(
  body: Record<string, unknown>,
  meta: { sourceIp?: string }
) {
  const signature = typeof body.sign === "string" ? body.sign : "";
  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as Record<string, unknown>)
      : null;

  if (!data) {
    await recordPaymentEvent({
      eventType: "signature_failed",
      sourceIp: meta.sourceIp,
      signatureValid: false,
      payload: { reason: "missing_data", channel: "withdraw" },
    });
    throw ApiError.badRequest("Invalid callback payload");
  }

  const signatureValid = verifyCallbackSignature(data, signature);
  const tradeId = typeof data.trade_id === "string" ? data.trade_id : undefined;
  const orderId = typeof data.order_id === "string" ? data.order_id : undefined;

  await recordPaymentEvent({
    merchantOrderId: tradeId ?? orderId,
    cipherbcOrderNo: tradeId ?? orderId,
    eventType: signatureValid ? "callback_received" : "signature_failed",
    sourceIp: meta.sourceIp,
    signatureValid,
    payload: { ...data, channel: "withdraw" },
  });

  if (!signatureValid) {
    throw ApiError.forbidden("Callback signature verification failed");
  }

  return buildCallbackAcknowledgement();
}

export async function listPayments(query: PaymentListQuery) {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.courseId) {
    filter.courseId = query.courseId;
  }

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { merchantOrderId: pattern },
      { cipherbcOrderNo: pattern },
      { userEmail: pattern },
      { userName: pattern },
      { courseTitle: pattern },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
    Payment.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toClient(item as Record<string, unknown>)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getPaymentById(id: string) {
  const item = await Payment.findOne({ _id: id, isDeleted: false }).lean();
  if (!item) {
    throw ApiError.notFound("Payment not found");
  }
  return toClient(item as Record<string, unknown>);
}

export async function listPaymentEvents(paymentId: string) {
  const payment = await Payment.findOne({ _id: paymentId, isDeleted: false }).lean();
  if (!payment) {
    throw ApiError.notFound("Payment not found");
  }

  const events = await PaymentEvent.find({
    $or: [{ paymentId }, { merchantOrderId: payment.merchantOrderId }],
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return events.map((event) => toClient(event as Record<string, unknown>));
}

export async function updatePaymentAdmin(id: string, input: AdminPaymentUpdate) {
  const payment = await Payment.findOne({ _id: id, isDeleted: false });
  if (!payment) {
    throw ApiError.notFound("Payment not found");
  }

  const update: Record<string, unknown> = {};

  if (input.notes !== undefined) {
    update.notes = input.notes;
  }

  if (input.reviewStatus !== undefined) {
    update.reviewStatus = input.reviewStatus;

    if (input.reviewStatus === "approved" && payment.status === "abnormal") {
      update.status = "completed";
      update.completedAt = new Date();
      await grantCourseAccess(payment.userId.toString(), payment.courseId);
    }
  }

  const updated = await Payment.findOneAndUpdate({ _id: id }, update, { new: true }).lean();

  await recordPaymentEvent({
    paymentId: id,
    merchantOrderId: payment.merchantOrderId,
    cipherbcOrderNo: payment.cipherbcOrderNo,
    eventType: "admin_update",
    payload: input as Record<string, unknown>,
  });

  return toClient(updated as Record<string, unknown>);
}

export async function resyncPaymentAdmin(id: string) {
  const payment = await Payment.findOne({ _id: id, isDeleted: false });
  if (!payment?.cipherbcOrderNo) {
    throw ApiError.badRequest("Payment has no CipherBC order number to sync");
  }

  const detail = await getH5OrderDetail(payment.cipherbcOrderNo);
  const updated = await applyOrderUpdate(
    payment,
    {
      status: detail.status,
      payments: mapCipherBcPayments(detail.payments as unknown as Array<Record<string, unknown>>),
      addresses: detail.addresses,
    },
    "status_sync",
    { payload: { adminResync: true, orderNo: payment.cipherbcOrderNo } }
  );

  return toClient((updated ?? payment.toObject()) as unknown as Record<string, unknown>);
}

export async function getPaymentStats() {
  const statuses = ["pending", "completed", "abnormal", "overpayment", "cancelled", "failed"] as const;
  const counts = await Promise.all(
    statuses.map((status) => Payment.countDocuments({ isDeleted: false, status }))
  );

  const total = counts.reduce((sum, count) => sum + count, 0);
  const pendingReview = await Payment.countDocuments({
    isDeleted: false,
    reviewStatus: "pending_review",
  });

  return statuses.reduce<Record<string, number>>(
    (acc, status, index) => {
      acc[status] = counts[index] ?? 0;
      return acc;
    },
    { total, pendingReview }
  );
}

export function buildWebhookAllowlistToken() {
  return crypto.randomBytes(16).toString("hex");
}
