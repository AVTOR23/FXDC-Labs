import type { Request, Response } from "express";
import { getUserById, listUsers, updateUserByAdmin } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AdminUpdateUserInput, UserListQuery } from "../validators/auth.validator.js";
import type { IdParams } from "../validators/common.validator.js";

export const listAdminUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await listUsers(req.query as unknown as UserListQuery);
  res.status(200).json(new ApiResponse(true, "Users", result.items, result.meta));
});

export const getAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const user = await getUserById(id);
  res.status(200).json(new ApiResponse(true, "User", user));
});

export const updateAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const user = await updateUserByAdmin(
    id,
    req.body as AdminUpdateUserInput,
    req.user?.role ?? "user"
  );
  res.status(200).json(new ApiResponse(true, "User updated", user));
});
