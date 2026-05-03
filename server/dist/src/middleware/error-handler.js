"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const http_1 = require("../utils/http");
function errorHandler(error, _req, res, _next) {
    if (error instanceof http_1.ApiError) {
        res.status(error.statusCode).json({
            ok: false,
            message: error.message,
            details: error.details ?? null
        });
        return;
    }
    if (error instanceof zod_1.ZodError) {
        res.status(http_1.HTTP.badRequest).json({
            ok: false,
            message: "Validation failed",
            details: error.issues
        });
        return;
    }
    if (error instanceof Error) {
        res.status(http_1.HTTP.internalServerError).json({
            ok: false,
            message: "Internal server error",
            details: process.env.NODE_ENV === "development" ? error.message : null
        });
        return;
    }
    res.status(http_1.HTTP.internalServerError).json({
        ok: false,
        message: "Internal server error",
        details: null
    });
}
