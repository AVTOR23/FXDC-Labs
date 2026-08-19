import { DUPLICATE_WINDOW_MS } from "../constants/options.js";
import { EducationApplication } from "../models/EducationApplication.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta, toClient } from "../utils/serialize.js";
import type { EducationApplicationInput } from "../validators/educationApplication.validator.js";
import type {
  ApplicationUpdate,
  PaginationQuery,
} from "../validators/common.validator.js";

export async function createEducationApplication(
  input: EducationApplicationInput,
  meta: { ip?: string; userAgent?: string; userId?: string }
) {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const duplicate = await EducationApplication.findOne({
    email: input.email,
    isDeleted: false,
    createdAt: { $gte: since },
  }).lean();

  if (duplicate) {
    throw ApiError.conflict(
      "An application with this email was already submitted recently."
    );
  }

  const created = await EducationApplication.create({
    ...input,
    submittedIp: meta.ip,
    userAgent: meta.userAgent,
    ...(meta.userId ? { submittedBy: meta.userId } : {}),
  });

  return { id: created._id.toString() };
}

export async function listEducationApplications(query: PaginationQuery) {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { completeName: pattern },
      { email: pattern },
      { telegramOrWhatsapp: pattern },
      { referredBy: pattern },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    EducationApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    EducationApplication.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toClient(item as Record<string, unknown>)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getEducationApplication(id: string) {
  const item = await EducationApplication.findOne({ _id: id, isDeleted: false }).lean();
  if (!item) {
    throw ApiError.notFound("Education application not found");
  }
  return toClient(item as Record<string, unknown>);
}

export async function updateEducationApplication(id: string, input: ApplicationUpdate) {
  const item = await EducationApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: input },
    { new: true, runValidators: true }
  ).lean();

  if (!item) {
    throw ApiError.notFound("Education application not found");
  }

  return toClient(item as Record<string, unknown>);
}

export async function deleteEducationApplication(id: string) {
  const item = await EducationApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!item) {
    throw ApiError.notFound("Education application not found");
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
