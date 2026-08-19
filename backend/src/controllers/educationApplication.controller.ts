import type { Request, Response } from "express";
import {
  createEducationApplication,
  deleteEducationApplication,
  getEducationApplication,
  listEducationApplications,
  updateEducationApplication,
} from "../services/educationApplication.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { EducationApplicationInput } from "../validators/educationApplication.validator.js";
import type {
  ApplicationUpdate,
  IdParams,
  PaginationQuery,
} from "../validators/common.validator.js";

export const submitEducationApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await createEducationApplication(req.body as EducationApplicationInput, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?.sub,
  });

  res.status(201).json(new ApiResponse(true, "Application submitted", data));
});

export const listEducation = asyncHandler(async (req: Request, res: Response) => {
  const result = await listEducationApplications(req.query as unknown as PaginationQuery);
  res.status(200).json(
    new ApiResponse(true, "Education applications", result.items, result.meta)
  );
});

export const getEducation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await getEducationApplication(id);
  res.status(200).json(new ApiResponse(true, "Education application", item));
});

export const updateEducation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await updateEducationApplication(id, req.body as ApplicationUpdate);
  res.status(200).json(new ApiResponse(true, "Application updated", item));
});

export const removeEducation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  await deleteEducationApplication(id);
  res.status(200).json(new ApiResponse(true, "Application deleted"));
});
