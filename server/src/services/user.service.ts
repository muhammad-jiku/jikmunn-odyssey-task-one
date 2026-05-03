import bcrypt from "bcryptjs";
import { UserModel, type UserDoc } from "../models/user.model";
import { ApiError, HTTP } from "../utils/http";
import type { ChangePasswordInput, UpdateAvatarInput, UpdateProfileInput } from "../validators/user.validator";

const SALT_ROUNDS = 12;

export interface UserView {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

function toView(doc: UserDoc & { _id: { toString(): string } }): UserView {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatarUrl: doc.avatarUrl,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

type UserEntity = UserDoc & {
  _id: { toString(): string };
  save: () => Promise<unknown>;
};

async function getUserOrThrow(userId: string): Promise<UserEntity> {
  const user = await UserModel.findById(userId).exec();
  if (!user) {
    throw new ApiError(HTTP.notFound, "User not found");
  }
  return user as UserEntity;
}

export async function getMe(userId: string): Promise<UserView> {
  return toView(await getUserOrThrow(userId));
}

export async function updateMe(userId: string, input: UpdateProfileInput): Promise<UserView> {
  const user = await getUserOrThrow(userId);

  if (input.email !== undefined) {
    const normalized = input.email.toLowerCase();
    const existing = await UserModel.findOne({ email: normalized }).exec();
    if (existing && existing._id.toString() !== userId) {
      throw new ApiError(HTTP.conflict, "Email is already registered");
    }
    user.email = normalized;
  }

  if (input.name !== undefined) {
    user.name = input.name;
  }

  await user.save();
  return toView(user);
}

export async function changeMyPassword(userId: string, input: ChangePasswordInput): Promise<void> {
  const user = await getUserOrThrow(userId);
  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw new ApiError(HTTP.unauthorized, "Current password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await user.save();
}

export async function updateMyAvatar(userId: string, input: UpdateAvatarInput): Promise<UserView> {
  const user = await getUserOrThrow(userId);
  user.avatarUrl = input.avatarUrl;
  await user.save();
  return toView(user);
}
