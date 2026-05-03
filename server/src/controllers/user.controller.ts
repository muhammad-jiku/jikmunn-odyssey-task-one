import type { Request, Response } from "express";
import { changeMyPassword, getMe, updateMe, updateMyAvatar } from "../services/user.service";
import { HTTP } from "../utils/http";
import { changePasswordSchema, updateAvatarSchema, updateProfileSchema } from "../validators/user.validator";

function getAuthUserId(req: Request): string | null {
  return req.auth?.userId ?? null;
}

export async function me(req: Request, res: Response): Promise<void> {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }
  const user = await getMe(userId);
  res.status(HTTP.ok).json({ ok: true, user });
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }

  const payload = updateProfileSchema.parse(req.body);
  const user = await updateMe(userId, payload);
  res.status(HTTP.ok).json({ ok: true, user, message: "Profile updated" });
}

export async function updatePassword(req: Request, res: Response): Promise<void> {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }

  const payload = changePasswordSchema.parse(req.body);
  await changeMyPassword(userId, payload);
  res.status(HTTP.ok).json({ ok: true, message: "Password updated" });
}

export async function updateAvatar(req: Request, res: Response): Promise<void> {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }

  const payload = updateAvatarSchema.parse(req.body);
  const user = await updateMyAvatar(userId, payload);
  res.status(HTTP.ok).json({ ok: true, user, message: "Avatar updated" });
}
