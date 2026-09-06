import type { Request, Response } from "express";
import {
  createContactSubmission,
  deleteContactSubmission,
  getContactSubmission,
  listContactSubmissions,
  updateContactSubmission,
} from "../services/contact.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { ContactSubmissionInput } from "../validators/contact.validator.js";
import type { ApplicationUpdate, IdParams, PaginationQuery } from "../validators/common.validator.js";

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const data = await createContactSubmission(req.body as ContactSubmissionInput, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?.sub,
  });

  res.status(201).json(new ApiResponse(true, "Request submitted", data));
});

export const listContacts = asyncHandler(async (req: Request, res: Response) => {
  const result = await listContactSubmissions(req.query as unknown as PaginationQuery);
  res.status(200).json(new ApiResponse(true, "Contact requests", result.items, result.meta));
});

export const getContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await getContactSubmission(id);
  res.status(200).json(new ApiResponse(true, "Contact request", item));
});

export const updateContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await updateContactSubmission(id, req.body as ApplicationUpdate);
  res.status(200).json(new ApiResponse(true, "Contact request updated", item));
});

export const removeContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  await deleteContactSubmission(id);
  res.status(200).json(new ApiResponse(true, "Contact request deleted"));
});
