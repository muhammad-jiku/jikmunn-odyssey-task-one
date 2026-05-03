import type { Request, Response } from "express";
import { createContactMessage, listContactMessages } from "../services/contact.service";
import { HTTP } from "../utils/http";
import { contactMessagesQuerySchema, createContactMessageSchema } from "../validators/contact.validator";

export async function create(req: Request, res: Response): Promise<void> {
  const payload = createContactMessageSchema.parse(req.body);
  const message = await createContactMessage(payload);
  res.status(HTTP.created).json({ ok: true, message: "Message submitted", contact: message });
}

export async function list(req: Request, res: Response): Promise<void> {
  const query = contactMessagesQuerySchema.parse(req.query);
  const result = await listContactMessages(query);
  res.status(HTTP.ok).json({ ok: true, ...result });
}
