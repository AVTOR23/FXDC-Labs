import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";
import type { UserRole } from "../models/User.js";

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: "fxdc-camp",
    audience: "fxdc-app",
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: "fxdc-camp",
      audience: "fxdc-app",
    });

    if (typeof decoded !== "object" || !decoded.sub || !decoded.email) {
      throw ApiError.unauthorized("Invalid token");
    }

    return decoded as JwtPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}
