import { DUPLICATE_WINDOW_MS } from "../constants/options.js";
import { LearningPathApplication } from "../models/LearningPathApplication.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta, toClient } from "../utils/serialize.js";
import type { LearningPathApplicationInput } from "../validators/learningPathApplication.validator.js";
import type { ApplicationUpdate, PaginationQuery } from "../validators/common.validator.js";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
      throw ApiError.conflict("An application for this payment was already submitted.");
    }
  }

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const duplicate = await LearningPathApplication.findOne({
    telegram: input.telegram,
    isDeleted: false,
    createdAt: { $gte: since },
  }).lean();

  if (duplicate) {
    throw ApiError.conflict("An application with this Telegram was already submitted recently.");
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
      { telegram: pattern },
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
    items: items.map((item) => toClient(item as Record<string, unknown>)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getLearningPathApplication(id: string) {
  const item = await LearningPathApplication.findOne({ _id: id, isDeleted: false }).lean();
  if (!item) {
    throw ApiError.notFound("Learning path application not found");
  }
  return toClient(item as Record<string, unknown>);
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

  return toClient(item as Record<string, unknown>);
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
