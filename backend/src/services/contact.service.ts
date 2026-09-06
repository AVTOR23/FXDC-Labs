import { DUPLICATE_WINDOW_MS } from "../constants/options.js";
import { ContactSubmission } from "../models/ContactSubmission.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta, toClient } from "../utils/serialize.js";
import type { ContactSubmissionInput } from "../validators/contact.validator.js";
import type { ApplicationUpdate, PaginationQuery } from "../validators/common.validator.js";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createContactSubmission(
  input: ContactSubmissionInput,
  meta: { ip?: string; userAgent?: string; userId?: string }
) {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const duplicate = await ContactSubmission.findOne({
    email: input.email,
    isDeleted: false,
    createdAt: { $gte: since },
  }).lean();

  if (duplicate) {
    throw ApiError.conflict("A request with this email was already submitted recently.");
  }

  const created = await ContactSubmission.create({
    ...input,
    submittedIp: meta.ip,
    userAgent: meta.userAgent,
    ...(meta.userId ? { submittedBy: meta.userId } : {}),
  });

  return { id: created._id.toString() };
}

export async function listContactSubmissions(query: PaginationQuery) {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: pattern },
      { email: pattern },
      { phone: pattern },
      { message: pattern },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    ContactSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
    ContactSubmission.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toClient(item as Record<string, unknown>)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getContactSubmission(id: string) {
  const item = await ContactSubmission.findOne({ _id: id, isDeleted: false }).lean();
  if (!item) {
    throw ApiError.notFound("Contact request not found");
  }
  return toClient(item as Record<string, unknown>);
}

export async function updateContactSubmission(id: string, input: ApplicationUpdate) {
  const item = await ContactSubmission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: input },
    { new: true, runValidators: true }
  ).lean();

  if (!item) {
    throw ApiError.notFound("Contact request not found");
  }

  return toClient(item as Record<string, unknown>);
}

export async function deleteContactSubmission(id: string) {
  const item = await ContactSubmission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!item) {
    throw ApiError.notFound("Contact request not found");
  }
}
