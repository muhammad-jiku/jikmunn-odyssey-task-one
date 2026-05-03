import type { Request, Response } from "express";
import
    {
        getCurrentUser,
        loginDemoUser,
        loginUser,
        logoutWithRefreshToken,
        refreshAuth,
        registerUser
    } from "../services/auth.service";
import { HTTP } from "../utils/http";
import
    {
        demoLoginSchema,
        loginSchema,
        logoutSchema,
        refreshSchema,
        registerSchema
    } from "../validators/auth.validator";

export async function register(req: Request, res: Response): Promise<void> {
  const payload = registerSchema.parse(req.body);
  const auth = await registerUser(payload.name, payload.email, payload.password);
  res.status(HTTP.created).json({ ok: true, ...auth });
}

export async function login(req: Request, res: Response): Promise<void> {
  const payload = loginSchema.parse(req.body);
  const auth = await loginUser(payload.email, payload.password);
  res.status(HTTP.ok).json({ ok: true, ...auth });
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  const payload = demoLoginSchema.parse(req.body ?? {});
  const auth = await loginDemoUser(payload.role ?? "user");
  res.status(HTTP.ok).json({ ok: true, ...auth });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const payload = refreshSchema.parse(req.body);
  const auth = await refreshAuth(payload.refreshToken);
  res.status(HTTP.ok).json({ ok: true, ...auth });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const payload = logoutSchema.parse(req.body);
  await logoutWithRefreshToken(payload.refreshToken);
  res.status(HTTP.ok).json({ ok: true, message: "Logged out" });
}

export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }

  const user = await getCurrentUser(userId);
  res.status(HTTP.ok).json({ ok: true, user });
}
