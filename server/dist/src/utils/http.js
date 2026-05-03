"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.HTTP = void 0;
exports.HTTP = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    unprocessableEntity: 422,
    internalServerError: 500,
    serviceUnavailable: 503
};
class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.ApiError = ApiError;
