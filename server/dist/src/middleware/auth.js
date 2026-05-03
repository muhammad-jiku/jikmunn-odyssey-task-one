"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const http_1 = require("../utils/http");
function getBearerToken(req) {
    const auth = req.header("authorization") || req.header("Authorization");
    if (!auth) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Missing authorization header");
    }
    const [scheme, token] = auth.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Invalid authorization format");
    }
    return token;
}
function requireAuth(req, _res, next) {
    const token = getBearerToken(req);
    let decoded;
    try {
        decoded = (0, jwt_1.verifyToken)(token, env_1.env.JWT_ACCESS_SECRET);
    }
    catch {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Invalid or expired access token");
    }
    if (decoded.type !== "access") {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Invalid access token type");
    }
    req.auth = {
        userId: decoded.sub,
        role: decoded.role,
        email: decoded.email
    };
    next();
}
function requireRole(roles) {
    return (req, _res, next) => {
        if (!req.auth) {
            throw new http_1.ApiError(http_1.HTTP.unauthorized, "Authentication required");
        }
        if (!roles.includes(req.auth.role)) {
            throw new http_1.ApiError(http_1.HTTP.forbidden, "Insufficient role permissions");
        }
        next();
    };
}
