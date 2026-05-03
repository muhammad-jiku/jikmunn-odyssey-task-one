import type { Request, Response } from "express";
import
    {
        deleteAdminItem,
        getAdminCharts,
        getAdminItems,
        getAdminOverview,
        getAdminUsers,
        updateAdminUserRole
    } from "../services/admin.service";
import { HTTP } from "../utils/http";
import { itemsAdminQuerySchema, updateUserRoleSchema, usersQuerySchema } from "../validators/admin.validator";

export async function overview(_req: Request, res: Response): Promise<void> {
  const stats = await getAdminOverview();
  res.status(HTTP.ok).json({ ok: true, stats });
}

export async function users(req: Request, res: Response): Promise<void> {
  const query = usersQuerySchema.parse(req.query);
  const result = await getAdminUsers(query);
  res.status(HTTP.ok).json({ ok: true, ...result });
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const payload = updateUserRoleSchema.parse(req.body);
  const user = await updateAdminUserRole(String(req.params.id), payload);
  res.status(HTTP.ok).json({ ok: true, user, message: "User role updated" });
}

export async function items(req: Request, res: Response): Promise<void> {
  const query = itemsAdminQuerySchema.parse(req.query);
  const result = await getAdminItems(query);
  res.status(HTTP.ok).json({ ok: true, ...result });
}

export async function removeItem(req: Request, res: Response): Promise<void> {
  await deleteAdminItem(String(req.params.id));
  res.status(HTTP.ok).json({ ok: true, message: "Item archived" });
}

export async function charts(_req: Request, res: Response): Promise<void> {
  const data = await getAdminCharts();
  res.status(HTTP.ok).json({ ok: true, data });
}
