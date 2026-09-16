import type { Request, Response } from "express";
import {
  attachMyLearningPathPayment,
  createLearningPathApplication,
  deleteLearningPathApplication,
  getLearningPathApplication,
  getMyLearningPathApplication,
  listLearningPathApplications,
  updateLearningPathApplication,
} from "../services/learningPathApplication.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type {
  AttachLearningPathPaymentInput,
  LearningPathApplicationInput,
} from "../validators/learningPathApplication.validator.js";
import type { ApplicationUpdate, IdParams, PaginationQuery } from "../validators/common.validator.js";

export const submitLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const data = await createLearningPathApplication(req.body as LearningPathApplicationInput, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?.sub,
  });

  res.status(201).json(new ApiResponse(true, "Application submitted", data));
});

export const getMyLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const applicationId =
    typeof req.query.applicationId === "string" ? req.query.applicationId : undefined;
  const item = await getMyLearningPathApplication(req.user!.sub, applicationId);
  res.status(200).json(new ApiResponse(true, "Learning path application", item));
});

export const attachMyLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const item = await attachMyLearningPathPayment(
    req.user!.sub,
    req.body as AttachLearningPathPaymentInput
  );
  res.status(200).json(new ApiResponse(true, "Payment attached to application", item));
});

export const listLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const result = await listLearningPathApplications(req.query as unknown as PaginationQuery);
  res.status(200).json(new ApiResponse(true, "Learning path applications", result.items, result.meta));
});

export const getLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await getLearningPathApplication(id);
  res.status(200).json(new ApiResponse(true, "Learning path application", item));
});

export const updateLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await updateLearningPathApplication(id, req.body as ApplicationUpdate);
  res.status(200).json(new ApiResponse(true, "Application updated", item));
});

export const removeLearningPath = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  await deleteLearningPathApplication(id);
  res.status(200).json(new ApiResponse(true, "Application deleted"));
});
