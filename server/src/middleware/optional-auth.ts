import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import type { UserRole } from "../models/user.model";
import { verifyToken } from "../utils/jwt";

type AccessTokenPayload = {
  sub: string;
  role: UserRole;
  email: string;
  type: "access";
};

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const auth = req.header("authorization") || req.header("Authorization");
  if (!auth) {
    next();
    return;
  }

  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    next();
    return;
  }

  try {
    const decoded = verifyToken<AccessTokenPayload>(token, env.JWT_ACCESS_SECRET);
    if (decoded.type === "access") {
      req.auth = {
        userId: decoded.sub,
        role: decoded.role,
        email: decoded.email
      };
    }
  } catch {
    // Ignore optional auth parsing errors for public routes.
  }

  next();
}
