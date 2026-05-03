"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;
exports.updateAvatar = updateAvatar;
const http_1 = require("../utils/http");
const user_service_1 = require("../services/user.service");
const user_validator_1 = require("../validators/user.validator");
function getAuthUserId(req) {
    return req.auth?.userId ?? null;
}
async function me(req, res) {
    const userId = getAuthUserId(req);
    if (!userId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const user = await (0, user_service_1.getMe)(userId);
    res.status(http_1.HTTP.ok).json({ ok: true, user });
}
async function updateProfile(req, res) {
    const userId = getAuthUserId(req);
    if (!userId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const payload = user_validator_1.updateProfileSchema.parse(req.body);
    const user = await (0, user_service_1.updateMe)(userId, payload);
    res.status(http_1.HTTP.ok).json({ ok: true, user, message: "Profile updated" });
}
async function updatePassword(req, res) {
    const userId = getAuthUserId(req);
    if (!userId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const payload = user_validator_1.changePasswordSchema.parse(req.body);
    await (0, user_service_1.changeMyPassword)(userId, payload);
    res.status(http_1.HTTP.ok).json({ ok: true, message: "Password updated" });
}
async function updateAvatar(req, res) {
    const userId = getAuthUserId(req);
    if (!userId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const payload = user_validator_1.updateAvatarSchema.parse(req.body);
    const user = await (0, user_service_1.updateMyAvatar)(userId, payload);
    res.status(http_1.HTTP.ok).json({ ok: true, user, message: "Avatar updated" });
}
