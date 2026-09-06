import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta } from "../utils/serialize.js";
import { toPublicUser } from "../utils/user.js";
import type { AdminUpdateUserInput, UserListQuery } from "../validators/auth.validator.js";

export async function listUsers(query: UserListQuery) {
  const filter: Record<string, unknown> = {};

  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: pattern },
      { username: pattern },
      { email: pattern },
      { telegramWhatsapp: pattern },
      { phone: pattern },
      { referralUsername: pattern },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
    User.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toPublicUser(item)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getUserById(id: string) {
  const user = await User.findById(id).lean();
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return toPublicUser(user);
}

export async function updateUserByAdmin(
  id: string,
  input: AdminUpdateUserInput,
  actorRole: "user" | "admin" | "superadmin"
) {
  const target = await User.findById(id).lean();
  if (!target) {
    throw ApiError.notFound("User not found");
  }

  if (actorRole !== "superadmin") {
    if (target.role === "superadmin" || input.role === "superadmin") {
      throw ApiError.forbidden("Only a super admin can change super admin accounts");
    }
  }

  if (input.username && input.username !== target.username) {
    const taken = await User.findOne({ username: input.username, _id: { $ne: id } }).lean();
    if (taken) {
      throw ApiError.conflict("This username is already taken");
    }
  }

  if (input.role === "user" || input.status === "banned") {
    if (target.role === "admin" || target.role === "superadmin") {
      const otherStaff = await User.countDocuments({
        _id: { $ne: id },
        role: { $in: ["admin", "superadmin"] },
        status: "active",
      });
      if (otherStaff === 0) {
        throw ApiError.badRequest("Cannot remove or ban the last admin account");
      }
    }
  }

  const user = await User.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean();
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return toPublicUser(user);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
