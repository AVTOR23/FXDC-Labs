import { env } from "../config/env.js";
import { User, type UserDocument } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { toPublicUser } from "../utils/user.js";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../validators/auth.validator.js";

function issueSession(user: UserDocument) {
  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    token,
    cookieName: env.COOKIE_NAME,
    user: toPublicUser(user.toObject()),
  };
}

export async function registerUser(input: RegisterInput) {
  const existingEmail = await User.findOne({ email: input.email }).lean();
  if (existingEmail) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const existingUsername = await User.findOne({ username: input.username }).lean();
  if (existingUsername) {
    throw ApiError.conflict("This username is already taken");
  }

  if (input.referralUsername) {
    const referrer = await User.findOne({ username: input.referralUsername }).lean();
    if (!referrer) {
      throw ApiError.badRequest("Referral username was not found");
    }
  }

  const created = await User.create({
    name: input.name,
    username: input.username,
    email: input.email,
    telegramWhatsapp: input.telegramWhatsapp ?? "",
    referralUsername: input.referralUsername ?? "",
    passwordHash: await hashPassword(input.password),
    role: "user",
    status: "active",
    lastLoginAt: new Date(),
  });

  return issueSession(created);
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  if (!user || user.status !== "active") {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return issueSession(user);
}

export async function getCurrentUser(id: string) {
  const user = await User.findById(id).lean();
  if (!user || user.status !== "active") {
    throw ApiError.unauthorized("Account is not available");
  }
  return toPublicUser(user);
}

export async function updateCurrentUser(id: string, input: UpdateProfileInput) {
  const user = await User.findOneAndUpdate(
    { _id: id, status: "active" },
    { $set: input },
    { new: true, runValidators: true }
  ).lean();

  if (!user) {
    throw ApiError.unauthorized("Account is not available");
  }

  return toPublicUser(user);
}

export async function changeCurrentPassword(id: string, input: ChangePasswordInput) {
  const user = await User.findById(id).select("+passwordHash");
  if (!user || user.status !== "active") {
    throw ApiError.unauthorized("Account is not available");
  }

  const valid = await comparePassword(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw ApiError.badRequest("Current password is incorrect");
  }

  user.passwordHash = await hashPassword(input.newPassword);
  await user.save();
}
