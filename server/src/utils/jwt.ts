import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { UserRole } from "../models/user.model";

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
  type: "access" | "refresh";
  jti?: string;
}

export function signToken(
  payload: AuthTokenPayload,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken<T>(token: string, secret: Secret): T {
  return jwt.verify(token, secret) as T;
}
