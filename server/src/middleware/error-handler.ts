import type { NextFunction, Request, Response } from "express";
import { ApiError, HTTP } from "../utils/http";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      ok: false,
      message: error.message,
      details: error.details ?? null
    });
    return;
  }

  if (error instanceof Error) {
    res.status(HTTP.internalServerError).json({
      ok: false,
      message: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : null
    });
    return;
  }

  res.status(HTTP.internalServerError).json({
    ok: false,
    message: "Internal server error",
    details: null
  });
}
