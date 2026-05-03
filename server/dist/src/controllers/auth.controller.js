"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.demoLogin = demoLogin;
exports.refresh = refresh;
exports.logout = logout;
exports.me = me;
const auth_service_1 = require("../services/auth.service");
const http_1 = require("../utils/http");
const auth_validator_1 = require("../validators/auth.validator");
async function register(req, res) {
    const payload = auth_validator_1.registerSchema.parse(req.body);
    const auth = await (0, auth_service_1.registerUser)(payload.name, payload.email, payload.password);
    res.status(http_1.HTTP.created).json({ ok: true, ...auth });
}
async function login(req, res) {
    const payload = auth_validator_1.loginSchema.parse(req.body);
    const auth = await (0, auth_service_1.loginUser)(payload.email, payload.password);
    res.status(http_1.HTTP.ok).json({ ok: true, ...auth });
}
async function demoLogin(req, res) {
    const payload = auth_validator_1.demoLoginSchema.parse(req.body ?? {});
    const auth = await (0, auth_service_1.loginDemoUser)(payload.role ?? "user");
    res.status(http_1.HTTP.ok).json({ ok: true, ...auth });
}
async function refresh(req, res) {
    const payload = auth_validator_1.refreshSchema.parse(req.body);
    const auth = await (0, auth_service_1.refreshAuth)(payload.refreshToken);
    res.status(http_1.HTTP.ok).json({ ok: true, ...auth });
}
async function logout(req, res) {
    const payload = auth_validator_1.logoutSchema.parse(req.body);
    await (0, auth_service_1.logoutWithRefreshToken)(payload.refreshToken);
    res.status(http_1.HTTP.ok).json({ ok: true, message: "Logged out" });
}
async function me(req, res) {
    const userId = req.auth?.userId;
    if (!userId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const user = await (0, auth_service_1.getCurrentUser)(userId);
    res.status(http_1.HTTP.ok).json({ ok: true, user });
}
