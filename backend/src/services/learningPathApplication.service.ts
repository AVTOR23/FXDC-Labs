import mongoose from "mongoose";
import { DUPLICATE_WINDOW_MS } from "../constants/options.js";
import { LearningPathApplication } from "../models/LearningPathApplication.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta, toClient } from "../utils/serialize.js";
import type {
  AttachLearningPathPaymentInput,
  LearningPathApplicationInput,
} from "../validators/learningPathApplication.validator.js";
import type { ApplicationUpdate, PaginationQuery } from "../validators/common.validator.js";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toApplication(item: Record<string, unknown>) {
  return toClient(item);
}

export async function createLearningPathApplication(
  input: LearningPathApplicationInput,
  meta: { ip?: string; userAgent?: string; userId?: string }
) {
  if (input.merchantOrderId) {
    const existingOrder = await LearningPathApplication.findOne({
      merchantOrderId: input.merchantOrderId,
      isDeleted: false,
    }).lean();

    if (existingOrder) {
      return { id: existingOrder._id.toString() };
    }
  }

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const duplicate = await LearningPathApplication.findOne({
    isDeleted: false,
    createdAt: { $gte: since },
    $or: [
      { telegram: input.telegram },
      ...(input.email ? [{ email: input.email.toLowerCase() }] : []),
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  if (duplicate) {
    return { id: duplicate._id.toString() };
  }

  const created = await LearningPathApplication.create({
    ...input,
    submittedIp: meta.ip,
    userAgent: meta.userAgent,
    ...(meta.userId ? { submittedBy: meta.userId } : {}),
  });

  return { id: created._id.toString() };
}

export async function listLearningPathApplications(query: PaginationQuery) {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: pattern },
      { username: pattern },
      { email: pattern },
      { telegram: pattern },
      { whatsapp: pattern },
      { merchantOrderId: pattern },
      { courseTitle: pattern },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    LearningPathApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    LearningPathApplication.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toApplication(item as Record<string, unknown>)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getLearningPathApplication(id: string) {
  const item = await LearningPathApplication.findOne({ _id: id, isDeleted: false }).lean();
  if (!item) {
    throw ApiError.notFound("Learning path application not found");
  }
  return toApplication(item as Record<string, unknown>);
}

async function findMyLearningPathApplication(
  userId: string,
  applicationId?: string
) {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw ApiError.unauthorized();
  }

  if (applicationId && mongoose.isValidObjectId(applicationId)) {
    const byId = await LearningPathApplication.findOne({
      _id: applicationId,
      isDeleted: false,
    }).lean();

    if (byId) {
      const ownerId = byId.submittedBy?.toString();
      const emailMatch =
        byId.email && user.email && byId.email.toLowerCase() === user.email.toLowerCase();
      const telegramMatch =
        byId.telegram &&
        user.telegramWhatsapp &&
        byId.telegram.toLowerCase() === user.telegramWhatsapp.toLowerCase();

      if (!ownerId || ownerId === userId || emailMatch || telegramMatch) {
        return byId;
      }
    }
  }

  const owned = await LearningPathApplication.findOne({
    submittedBy: userId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (owned) return owned;

  const identity: Record<string, unknown>[] = [];
  if (user.email) identity.push({ email: user.email.toLowerCase() });
  if (user.telegramWhatsapp) identity.push({ telegram: user.telegramWhatsapp });

  if (!identity.length) return null;

  return LearningPathApplication.findOne({
    isDeleted: false,
    $or: identity,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getMyLearningPathApplication(userId: string, applicationId?: string) {
  const item = await findMyLearningPathApplication(userId, applicationId);
  if (!item) {
    throw ApiError.notFound("No workshop application found for this account");
  }
  return toApplication(item as Record<string, unknown>);
}

export async function attachMyLearningPathPayment(
  userId: string,
  input: AttachLearningPathPaymentInput
) {
  const item = await findMyLearningPathApplication(userId, input.applicationId);

  if (!item) {
    throw ApiError.notFound("No workshop application found for this account");
  }

  const updated = await LearningPathApplication.findOneAndUpdate(
    { _id: item._id, isDeleted: false },
    {
      $set: {
        submittedBy: userId,
        merchantOrderId: input.merchantOrderId,
        ...(input.paymentAmount ? { paymentAmount: input.paymentAmount } : {}),
        ...(input.courseTitle ? { courseTitle: input.courseTitle } : {}),
      },
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) {
    throw ApiError.notFound("Learning path application not found");
  }

  return toApplication(updated as Record<string, unknown>);
}

export async function updateLearningPathApplication(id: string, input: ApplicationUpdate) {
  const item = await LearningPathApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: input },
    { new: true, runValidators: true }
  ).lean();

  if (!item) {
    throw ApiError.notFound("Learning path application not found");
  }

  return toApplication(item as Record<string, unknown>);
}

export async function deleteLearningPathApplication(id: string) {
  const item = await LearningPathApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!item) {
    throw ApiError.notFound("Learning path application not found");
  }
}
