import crypto from "crypto";
import { getCipherBcConfig } from "../config/cipherbc.js";
import { signPayload, verifyPayloadSignature } from "../utils/cipherbcSignature.js";
import { ApiError } from "../utils/ApiError.js";

type CipherBcApiResponse<T> = {
  status: number;
  msg: string;
  data: T;
  date_time?: string;
  time_stamp?: number;
  sign: string;
};

type CreateOrderData = {
  order_no: string;
  merchant_order_id: string;
  amount: string;
  currency: string;
  status: number;
  created_at?: number;
  expires_at?: number;
  return_url?: string;
  checkout_url: string;
  addresses?: Array<{ coin: string; address: string; amount: string }>;
};

type OrderDetailData = CreateOrderData & {
  payments?: Array<{
    coin: string;
    address: string;
    txid: string;
    amount: string;
    confirm_time?: number;
    status?: number;
    check_status?: number;
    check_code?: number;
  }>;
};

function currentTimestamp(): string {
  return String(Math.floor(Date.now() / 1000));
}

function buildSignedRequest(params: Record<string, unknown>) {
  const config = getCipherBcConfig();
  const payload: Record<string, unknown> = {
    version: "1.0",
    app_id: config.appId,
    key_version: config.keyVersion,
    time: currentTimestamp(),
    ...params,
  };

  payload.sign = signPayload(payload, config.merchantPrivateKey);
  return payload;
}

async function postCipherBc<T>(path: string, params: Record<string, unknown>): Promise<T> {
  const config = getCipherBcConfig();
  const body = buildSignedRequest(params);
  const url = `${config.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  const raw = (await response.json().catch(() => null)) as CipherBcApiResponse<T> | null;

  if (!response.ok || !raw) {
    throw ApiError.internal("CipherBC API request failed");
  }

  if (!verifyPayloadSignature(raw as unknown as Record<string, unknown>, raw.sign, config.platformPublicKey)) {
    throw ApiError.internal("CipherBC response signature verification failed");
  }

  if (raw.status !== 200) {
    throw ApiError.badRequest(raw.msg || "CipherBC rejected the request");
  }

  return raw.data;
}

export async function createH5DepositOrder(input: {
  merchantOrderId: string;
  amount: string;
  currency: string;
  returnUrl: string;
  successUrl: string;
  failUrl: string;
}) {
  return postCipherBc<CreateOrderData>("/h5_order/create", {
    merchant_order_id: input.merchantOrderId,
    amount: input.amount,
    currency: input.currency,
    return_url: input.returnUrl,
    success_url: input.successUrl,
    fail_url: input.failUrl,
    hide_back: 0,
    lang: "en",
  });
}

export async function getH5OrderDetail(orderNo: string) {
  return postCipherBc<OrderDetailData>("/h5_order/detail", { order_no: orderNo });
}

export async function cancelH5Order(orderNo: string) {
  return postCipherBc<Record<string, never>>("/h5_order/cancel", { order_no: orderNo });
}

export function buildCallbackAcknowledgement() {
  const config = getCipherBcConfig();
  const data = { success_data: "success" };
  const response = {
    status: 200,
    data,
    sign: signPayload(data, config.merchantPrivateKey),
  };

  return response;
}

export function verifyCallbackSignature(data: Record<string, unknown>, signature: string) {
  const config = getCipherBcConfig();
  return verifyPayloadSignature(data, signature, config.platformPublicKey);
}

export function hashCallbackPayload(data: Record<string, unknown>, signature: string) {
  return crypto.createHash("sha256").update(JSON.stringify({ data, signature })).digest("hex");
}

export function generateMerchantOrderId() {
  const random = crypto.randomBytes(6).toString("hex");
  return `FXDC${Date.now()}${random}`.slice(0, 32);
}
