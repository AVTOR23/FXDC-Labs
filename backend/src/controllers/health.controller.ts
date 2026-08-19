import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : "disconnected";

  res.status(dbState === 1 ? 200 : 503).json(
    new ApiResponse(dbState === 1, "Health check", {
      status: dbState === 1 ? "ok" : "degraded",
      database: dbStatus,
      uptime: process.uptime(),
    })
  );
});
