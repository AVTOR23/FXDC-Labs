import type { Request, Response } from "express";
import {
  deleteMedia,
  listMedia,
  uploadImageToCloudinary,
} from "../services/upload.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { IdParams, PaginationQuery } from "../validators/common.validator.js";

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  const data = await uploadImageToCloudinary(file, req.user?.sub);
  res.status(201).json(new ApiResponse(true, "Image uploaded", data));
});

export const listUploads = asyncHandler(async (req: Request, res: Response) => {
  const result = await listMedia(req.query as unknown as PaginationQuery);
  res.status(200).json(new ApiResponse(true, "Media library", result.items, result.meta));
});

export const removeMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  await deleteMedia(id);
  res.status(200).json(new ApiResponse(true, "Media deleted"));
});
