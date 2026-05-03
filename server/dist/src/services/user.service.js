"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.changeMyPassword = changeMyPassword;
exports.updateMyAvatar = updateMyAvatar;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const http_1 = require("../utils/http");
const SALT_ROUNDS = 12;
function toView(doc) {
    return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        avatarUrl: doc.avatarUrl,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString()
    };
}
async function getUserOrThrow(userId) {
    const user = await user_model_1.UserModel.findById(userId).exec();
    if (!user) {
        throw new http_1.ApiError(http_1.HTTP.notFound, "User not found");
    }
    return user;
}
async function getMe(userId) {
    return toView(await getUserOrThrow(userId));
}
async function updateMe(userId, input) {
    const user = await getUserOrThrow(userId);
    if (input.email !== undefined) {
        const normalized = input.email.toLowerCase();
        const existing = await user_model_1.UserModel.findOne({ email: normalized }).exec();
        if (existing && existing._id.toString() !== userId) {
            throw new http_1.ApiError(http_1.HTTP.conflict, "Email is already registered");
        }
        user.email = normalized;
    }
    if (input.name !== undefined) {
        user.name = input.name;
    }
    await user.save();
    return toView(user);
}
async function changeMyPassword(userId, input) {
    const user = await getUserOrThrow(userId);
    const valid = await bcryptjs_1.default.compare(input.currentPassword, user.passwordHash);
    if (!valid) {
        throw new http_1.ApiError(http_1.HTTP.unauthorized, "Current password is incorrect");
    }
    user.passwordHash = await bcryptjs_1.default.hash(input.newPassword, SALT_ROUNDS);
    await user.save();
}
async function updateMyAvatar(userId, input) {
    const user = await getUserOrThrow(userId);
    user.avatarUrl = input.avatarUrl;
    await user.save();
    return toView(user);
}
