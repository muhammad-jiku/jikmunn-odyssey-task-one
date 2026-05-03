import type { Request, Response } from "express";
import { HTTP } from "../utils/http";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(HTTP.notFound).json({
    ok: false,
    message: "Route not found"
  });
}
