"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = optionalAuth;
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
function optionalAuth(req, _res, next) {
    const auth = req.header("authorization") || req.header("Authorization");
    if (!auth) {
        next();
        return;
    }
    const [scheme, token] = auth.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        next();
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token, env_1.env.JWT_ACCESS_SECRET);
        if (decoded.type === "access") {
            req.auth = {
                userId: decoded.sub,
                role: decoded.role,
                email: decoded.email
            };
        }
    }
    catch {
        // Ignore optional auth parsing errors for public routes.
    }
    next();
}
