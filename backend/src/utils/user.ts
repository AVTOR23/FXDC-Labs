import type { UserDocument, UserRole, UserStatus } from "../models/User.js";

export type PublicUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  telegramWhatsapp: string;
  referralUsername: string;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicUser(user: UserDocument | Record<string, unknown>): PublicUser {
  const source = user as Record<string, unknown> & {
    _id?: { toString(): string };
    id?: string;
  };

  return {
    id: source.id ?? source._id?.toString() ?? "",
    name: String(source.name ?? ""),
    username: String(source.username ?? ""),
    email: String(source.email ?? ""),
    phone: String(source.telegramWhatsapp || source.phone || ""),
    telegramWhatsapp: String(source.telegramWhatsapp || source.phone || ""),
    referralUsername: String(source.referralUsername ?? ""),
    avatarUrl: String(source.avatarUrl ?? ""),
    role: (source.role as UserRole) ?? "user",
    status: (source.status as UserStatus) ?? "active",
    lastLoginAt: source.lastLoginAt as Date | undefined,
    createdAt: source.createdAt as Date,
    updatedAt: source.updatedAt as Date,
  };
}
