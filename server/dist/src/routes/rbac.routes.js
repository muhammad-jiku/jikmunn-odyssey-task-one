"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
exports.rbacRouter = (0, express_1.Router)();
exports.rbacRouter.get("/protected/profile", auth_1.requireAuth, (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Authenticated access granted",
        auth: req.auth
    });
});
exports.rbacRouter.get("/protected/admin", auth_1.requireAuth, (0, auth_1.requireRole)(["admin"]), (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Admin access granted",
        auth: req.auth
    });
});
