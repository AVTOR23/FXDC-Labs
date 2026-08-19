import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { isProduction } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound("Route not found"));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      success: false,
      message: "Validation failed",
      error: err.flatten(),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      ok: false,
      success: false,
      message: err.message,
      error: err.details,
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      ok: false,
      success: false,
      message: "Validation failed",
      error: err.errors,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      ok: false,
      success: false,
      message: "Invalid identifier",
    });
  }

  if (isMongoDuplicateError(err)) {
    return res.status(409).json({
      ok: false,
      success: false,
      message: "A record with this value already exists",
    });
  }

  if (err instanceof Error && err.message.includes("CORS")) {
    return res.status(403).json({
      ok: false,
      success: false,
      message: "Origin not allowed",
    });
  }

  logger.error(err);

  return res.status(500).json({
    ok: false,
    success: false,
    message: isProduction ? "Internal server error" : getErrorMessage(err),
  });
}

function isMongoDuplicateError(err: unknown): boolean {
  return Boolean(err && typeof err === "object" && "code" in err && err.code === 11000);
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Internal server error";
}
