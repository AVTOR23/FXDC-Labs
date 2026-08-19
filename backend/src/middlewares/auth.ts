import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

function extractToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }

  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  return typeof cookieToken === "string" ? cookieToken : undefined;
}

async function loadActiveUser(req: Request) {
  const token = extractToken(req);
  if (!token) {
    throw ApiError.unauthorized();
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.sub).lean();

  if (!user || user.status !== "active") {
    throw ApiError.unauthorized("Account is not available");
  }

  req.user = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return user;
}

export const optionalAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  if (!extractToken(req)) {
    next();
    return;
  }

  try {
    await loadActiveUser(req);
  } catch {
    // Ignore invalid tokens on public routes.
  }

  next();
});

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  await loadActiveUser(req);
  next();
});

export const requireAdmin = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const user = await loadActiveUser(req);
  if (user.role !== "admin" && user.role !== "superadmin") {
    throw ApiError.forbidden("Admin access required");
  }
  next();
});
