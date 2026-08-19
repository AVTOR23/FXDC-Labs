import type { Request, Response } from "express";
import { getDashboardStats } from "../services/stats.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getDashboardStats();
  res.status(200).json(new ApiResponse(true, "Dashboard stats", data));
});
