import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import { logger } from "../utils/logger.js";

async function upsertStaff(options: {
  email: string;
  password: string;
  name: string;
  role: "admin" | "superadmin";
}) {
  const passwordHash = await hashPassword(options.password);
  const user = await User.findOneAndUpdate(
    { email: options.email.toLowerCase() },
    {
      name: options.name,
      email: options.email.toLowerCase(),
      passwordHash,
      role: options.role,
      status: "active",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  logger.info(`${options.role} ready: ${user.email}`);
}

export async function ensureStaffAccounts(): Promise<void> {
  if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    await upsertStaff({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      name: "FXDC Admin",
      role: "admin",
    });
  }

  if (env.SUPER_ADMIN_EMAIL && env.SUPER_ADMIN_PASSWORD) {
    await upsertStaff({
      email: env.SUPER_ADMIN_EMAIL,
      password: env.SUPER_ADMIN_PASSWORD,
      name: "FXDC Super Admin",
      role: "superadmin",
    });
    return;
  }

  throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env");
}
