"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDemoUsers = ensureDemoUsers;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.loginDemoUser = loginDemoUser;
exports.refreshAuth = refreshAuth;
exports.logoutWithRefreshToken = logoutWithRefreshToken;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = require("node:crypto");
const env_1 = require("../config/env");
const refresh_token_model_1 = require("../models/refresh-token.model");
const user_model_1 = require("../models/user.model");
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const http_1 = require("../utils/http");
const SALT_ROUNDS = 12;
function toPublicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    };
}
function buildTokenPayload(user) {
    return {
        sub: user._id.toString(),
        role: user.role,
        email: user.email
    };
}
async function issueAuthTokens(user) {
    const base = buildTokenPayload(user);
    const accessToken = (0, jwt_1.signToken)({ ...base, type: "access", jti: (0, node_crypto_1.randomUUID)() }, env_1.env.JWT_ACCESS_SECRET, env_1.env.JWT_ACCESS_EXPIRES_IN);
    const refreshToken = (0, jwt_1.signToken)({ ...base, type: "refresh", jti: (0, node_crypto_1.randomUUID)() }, env_1.env.JWT_REFRESH_SECRET, env_1.env.JWT_REFRESH_EXPIRES_IN);
    const decoded = (0, jwt_1.verifyToken)(refreshToken, env_1.env.JWT_REFRESH_SECRET);
    await refresh_token_model_1.RefreshTokenModel.create({
        userId: user._id,
        tokenHash: (0, crypto_1.sha256)(refreshToken),
        expiresAt: new Date(decoded.exp * 1000)
    });
    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken
    };
}
async function ensureDemoUsers() {
    await upsertDemoUser("admin", env_1.env.DEMO_ADMIN_NAME, env_1.env.DEMO_ADMIN_EMAIL, env_1.env.DEMO_ADMIN_PASSWORD);
    await upsertDemoUser("user", env_1.env.DEMO_USER_NAME, env_1.env.DEMO_USER_EMAIL, env_1.env.DEMO_USER_PASSWORD);
}
async function upsertDemoUser(role, name, email, password) {
    const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
    await user_model_1.UserModel.findOneAndUpdate({ email: email.toLowerCase() }, {
        $set: {
            name,
            email: email.toLowerCase(),
            role,
            passwordHash
        }
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
}
async function registerUser(name, email, password) {
    const normalizedEmail = email.toLowerCase();
    const existing = await user_model_1.UserModel.findOne({ email: normalizedEmail });
    if (existing) {
        throw new http_1.ApiError(http_1.HTTP.conflict, "Email is already registered");
    }
    const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
    const user = await user_model_1.UserModel.create({
        name,
        email: normalizedEmail,
        passwordHash,
        role: "user"
    });
    return issueAuthTokens(user);
}
async function loginUser(email, password) {
    const normalizedEmail = email.toLowerCase();
    const user = await user_model_1.UserModel.findOne({ email: normalizedEmail });
    if (!user) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Invalid credentials");
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Invalid credentials");
    }
    user.lastLoginAt = new Date();
    await user.save();
    return issueAuthTokens(user);
}
async function loginDemoUser(role) {
    const email = role === "admin" ? env_1.env.DEMO_ADMIN_EMAIL : env_1.env.DEMO_USER_EMAIL;
    const password = role === "admin" ? env_1.env.DEMO_ADMIN_PASSWORD : env_1.env.DEMO_USER_PASSWORD;
    return loginUser(email, password);
}
async function refreshAuth(refreshToken) {
    let decoded;
    try {
        decoded = (0, jwt_1.verifyToken)(refreshToken, env_1.env.JWT_REFRESH_SECRET);
    }
    catch {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Refresh token is invalid or expired");
    }
    if (decoded.type !== "refresh") {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Invalid refresh token type");
    }
    const tokenHash = (0, crypto_1.sha256)(refreshToken);
    const stored = await refresh_token_model_1.RefreshTokenModel.findOne({ tokenHash });
    if (!stored || stored.revokedAt || stored.expiresAt.getTime() <= Date.now()) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Refresh token is invalid or expired");
    }
    const user = await user_model_1.UserModel.findById(stored.userId);
    if (!user) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "User no longer exists");
    }
    stored.revokedAt = new Date();
    await stored.save();
    return issueAuthTokens(user);
}
async function logoutWithRefreshToken(refreshToken) {
    const tokenHash = (0, crypto_1.sha256)(refreshToken);
    const stored = await refresh_token_model_1.RefreshTokenModel.findOne({ tokenHash });
    if (!stored || stored.revokedAt) {
        return;
    }
    stored.revokedAt = new Date();
    await stored.save();
}
async function getCurrentUser(userId) {
    const user = await user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new http_1.ApiError(http_1.HTTP.notFound, "User not found");
    }
    return toPublicUser(user);
}
