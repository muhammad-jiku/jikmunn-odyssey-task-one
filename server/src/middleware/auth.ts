import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import type { UserRole } from "../models/user.model";
import { ApiError, HTTP } from "../utils/http";
import { verifyToken } from "../utils/jwt";

type AccessTokenPayload = {
  sub: string;
  role: UserRole;
  email: string;
  type: "access";
  iat: number;
  exp: number;
};

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      role: UserRole;
      email: string;
    };
  }
}

function getBearerToken(req: Request): string {
  const auth = req.header("authorization") || req.header("Authorization");
  if (!auth) {
    throw new ApiError(HTTP.unauthorized, "Missing authorization header");
  }
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new ApiError(HTTP.unauthorized, "Invalid authorization format");
  }
  return token;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = getBearerToken(req);
  let decoded: AccessTokenPayload;
  try {
    decoded = verifyToken<AccessTokenPayload>(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(HTTP.unauthorized, "Invalid or expired access token");
  }
  if (decoded.type !== "access") {
    throw new ApiError(HTTP.unauthorized, "Invalid access token type");
  }

  req.auth = {
    userId: decoded.sub,
    role: decoded.role,
    email: decoded.email
  };
  next();
}

export function requireRole(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw new ApiError(HTTP.unauthorized, "Authentication required");
    }
    if (!roles.includes(req.auth.role)) {
      throw new ApiError(HTTP.forbidden, "Insufficient role permissions");
    }
    next();
  };
}
