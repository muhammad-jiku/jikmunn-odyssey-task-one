import type { Request, Response } from "express";
import
    {
        createItem,
        deleteItem,
        getItemById,
        listItems,
        updateItem
    } from "../services/item.service";
import { HTTP } from "../utils/http";
import
    {
        createItemSchema,
        itemsQuerySchema,
        updateItemSchema
    } from "../validators/item.validator";

export async function list(req: Request, res: Response): Promise<void> {
  const query = itemsQuerySchema.parse(req.query);
  if (query.owner === "me" && !req.auth?.userId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }
  const ownerId = query.owner === "me" ? req.auth?.userId : undefined;
  const result = await listItems(query, ownerId);
  res.status(HTTP.ok).json({ ok: true, ...result });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const item = await getItemById(String(req.params.id));
  res.status(HTTP.ok).json({ ok: true, item });
}

export async function create(req: Request, res: Response): Promise<void> {
  const payload = createItemSchema.parse(req.body);
  const ownerId = req.auth?.userId;
  if (!ownerId) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }
  const item = await createItem(payload, ownerId);
  res.status(HTTP.created).json({ ok: true, item });
}

export async function update(req: Request, res: Response): Promise<void> {
  const payload = updateItemSchema.parse(req.body);
  const auth = req.auth;
  if (!auth) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }
  const item = await updateItem(String(req.params.id), payload, {
    userId: auth.userId,
    role: auth.role
  });
  res.status(HTTP.ok).json({ ok: true, item });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const auth = req.auth;
  if (!auth) {
    res.status(HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
    return;
  }
  await deleteItem(String(req.params.id), { userId: auth.userId, role: auth.role });
  res.status(HTTP.ok).json({ ok: true, message: "Item deleted" });
}
