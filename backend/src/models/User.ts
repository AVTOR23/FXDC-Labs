import mongoose, { Schema } from "mongoose";

export const USER_ROLES = ["user", "admin", "superadmin"] as const;
export const USER_STATUSES = ["active", "banned"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface UserDocument extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  phone: string;
  telegramWhatsapp: string;
  referralUsername: string;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  purchasedCourses: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 30,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    telegramWhatsapp: { type: String, default: "", trim: true, maxlength: 80 },
    referralUsername: { type: String, default: "", trim: true, lowercase: true, maxlength: 30 },
    avatarUrl: { type: String, default: "", trim: true, maxlength: 500 },
    role: { type: String, enum: USER_ROLES, default: "user", index: true },
    status: { type: String, enum: USER_STATUSES, default: "active", index: true },
    purchasedCourses: { type: [String], default: [] },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ createdAt: -1 });
UserSchema.index({ name: 1 });
UserSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $type: "string", $gt: "" } } }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
