import type { Request, Response } from "express";
import { env } from "../config/env.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  registerUser,
  updateCurrentUser,
} from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authCookieOptions } from "../utils/cookies.js";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../validators/auth.validator.js";

function sendAuth(res: Response, result: { token: string; cookieName: string; user: unknown }, status = 200) {
  res.cookie(result.cookieName, result.token, authCookieOptions());
  res.status(status).json(
    new ApiResponse(true, status === 201 ? "Account created" : "Logged in", {
      token: result.token,
      user: result.user,
    })
  );
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body as RegisterInput);
  sendAuth(res, result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body as LoginInput);
  sendAuth(res, result);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.COOKIE_NAME, authCookieOptions());
  res.status(200).json(new ApiResponse(true, "Logged out"));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.sub);
  res.status(200).json(new ApiResponse(true, "Current user", user));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateCurrentUser(req.user!.sub, req.body as UpdateProfileInput);
  res.status(200).json(new ApiResponse(true, "Profile updated", user));
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await changeCurrentPassword(req.user!.sub, req.body as ChangePasswordInput);
  res.status(200).json(new ApiResponse(true, "Password updated"));
});
