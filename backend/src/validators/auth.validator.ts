import { z } from "zod";
import { USER_ROLES, USER_STATUSES } from "../models/User.js";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username is too long")
  .regex(/^[a-z0-9._]+$/, "Use letters, numbers, dots, or underscores");

const optionalUsernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(30)
  .refine((value) => value === "" || /^[a-z0-9._]{3,30}$/.test(value), {
    message: "Use 3–30 letters, numbers, dots, or underscores",
  })
  .optional()
  .default("");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required").max(120),
    username: usernameSchema,
    email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
    telegramWhatsapp: z.string().trim().max(80).optional().default(""),
    referralUsername: optionalUsernameSchema,
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  telegramWhatsapp: z.string().trim().max(80).optional(),
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(120).optional(),
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(USER_STATUSES).optional(),
});

export const adminUpdateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    username: usernameSchema.optional(),
    telegramWhatsapp: z.string().trim().max(80).optional(),
    referralUsername: z
      .string()
      .trim()
      .toLowerCase()
      .max(30)
      .refine((value) => value === "" || /^[a-z0-9._]{3,30}$/.test(value), {
        message: "Use 3–30 letters, numbers, dots, or underscores",
      })
      .optional(),
    role: z.enum(USER_ROLES).optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
