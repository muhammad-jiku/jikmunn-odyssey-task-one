import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import { RefreshTokenModel } from "../models/refresh-token.model";
import { UserModel, type UserDoc, type UserRole } from "../models/user.model";
import { sha256 } from "../utils/crypto";
import { ApiError, HTTP } from "../utils/http";
import { signToken, verifyToken, type AuthTokenPayload } from "../utils/jwt";

interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

interface RefreshPayload {
  sub: string;
  role: UserRole;
  email: string;
  type: "refresh";
  iat: number;
  exp: number;
}

const SALT_ROUNDS = 12;

function toPublicUser(user: UserDoc & { _id: { toString(): string } }): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

function buildTokenPayload(user: UserDoc & { _id: { toString(): string } }): Omit<AuthTokenPayload, "type"> {
  return {
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  };
}

async function issueAuthTokens(user: UserDoc & { _id: { toString(): string } }): Promise<AuthResponse> {
  const base = buildTokenPayload(user);
  const accessToken = signToken(
    { ...base, type: "access", jti: randomUUID() },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN as Parameters<typeof signToken>[2]
  );
  const refreshToken = signToken(
    { ...base, type: "refresh", jti: randomUUID() },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN as Parameters<typeof signToken>[2]
  );

  const decoded = verifyToken<RefreshPayload>(refreshToken, env.JWT_REFRESH_SECRET);
  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: sha256(refreshToken),
    expiresAt: new Date(decoded.exp * 1000)
  });

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken
  };
}

export async function ensureDemoUsers(): Promise<void> {
  await upsertDemoUser("admin", env.DEMO_ADMIN_NAME, env.DEMO_ADMIN_EMAIL, env.DEMO_ADMIN_PASSWORD);
  await upsertDemoUser("user", env.DEMO_USER_NAME, env.DEMO_USER_EMAIL, env.DEMO_USER_PASSWORD);
}

async function upsertDemoUser(role: UserRole, name: string, email: string, password: string): Promise<void> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        name,
        email: email.toLowerCase(),
        role,
        passwordHash
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase();
  const existing = await UserModel.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(HTTP.conflict, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role: "user"
  });

  return issueAuthTokens(user as UserDoc & { _id: { toString(): string } });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(HTTP.unauthorized, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(HTTP.unauthorized, "Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return issueAuthTokens(user as UserDoc & { _id: { toString(): string } });
}

export async function loginDemoUser(role: UserRole): Promise<AuthResponse> {
  const email = role === "admin" ? env.DEMO_ADMIN_EMAIL : env.DEMO_USER_EMAIL;
  const password = role === "admin" ? env.DEMO_ADMIN_PASSWORD : env.DEMO_USER_PASSWORD;
  return loginUser(email, password);
}

export async function refreshAuth(refreshToken: string): Promise<AuthResponse> {
  let decoded: RefreshPayload;
  try {
    decoded = verifyToken<RefreshPayload>(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(HTTP.unauthorized, "Refresh token is invalid or expired");
  }
  if (decoded.type !== "refresh") {
    throw new ApiError(HTTP.unauthorized, "Invalid refresh token type");
  }

  const tokenHash = sha256(refreshToken);
  const stored = await RefreshTokenModel.findOne({ tokenHash });
  if (!stored || stored.revokedAt || stored.expiresAt.getTime() <= Date.now()) {
    throw new ApiError(HTTP.unauthorized, "Refresh token is invalid or expired");
  }

  const user = await UserModel.findById(stored.userId);
  if (!user) {
    throw new ApiError(HTTP.unauthorized, "User no longer exists");
  }

  stored.revokedAt = new Date();
  await stored.save();

  return issueAuthTokens(user as UserDoc & { _id: { toString(): string } });
}

export async function logoutWithRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = sha256(refreshToken);
  const stored = await RefreshTokenModel.findOne({ tokenHash });
  if (!stored || stored.revokedAt) {
    return;
  }
  stored.revokedAt = new Date();
  await stored.save();
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(HTTP.notFound, "User not found");
  }
  return toPublicUser(user as UserDoc & { _id: { toString(): string } });
}
