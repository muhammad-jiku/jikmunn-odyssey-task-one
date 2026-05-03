import type { Request, Response } from "express";
import { getHealthPayload } from "../services/health.service";
import { HTTP } from "../utils/http";

export function getHealth(_req: Request, res: Response): void {
  const payload = getHealthPayload();
  const status = payload.db.connected ? HTTP.ok : HTTP.serviceUnavailable;
  res.status(status).json(payload);
}
