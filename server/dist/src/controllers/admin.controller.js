"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overview = overview;
exports.users = users;
exports.updateUserRole = updateUserRole;
exports.items = items;
exports.removeItem = removeItem;
exports.charts = charts;
const admin_service_1 = require("../services/admin.service");
const http_1 = require("../utils/http");
const admin_validator_1 = require("../validators/admin.validator");
async function overview(_req, res) {
    const stats = await (0, admin_service_1.getAdminOverview)();
    res.status(http_1.HTTP.ok).json({ ok: true, stats });
}
async function users(req, res) {
    const query = admin_validator_1.usersQuerySchema.parse(req.query);
    const result = await (0, admin_service_1.getAdminUsers)(query);
    res.status(http_1.HTTP.ok).json({ ok: true, ...result });
}
async function updateUserRole(req, res) {
    const payload = admin_validator_1.updateUserRoleSchema.parse(req.body);
    const user = await (0, admin_service_1.updateAdminUserRole)(String(req.params.id), payload);
    res.status(http_1.HTTP.ok).json({ ok: true, user, message: "User role updated" });
}
async function items(req, res) {
    const query = admin_validator_1.itemsAdminQuerySchema.parse(req.query);
    const result = await (0, admin_service_1.getAdminItems)(query);
    res.status(http_1.HTTP.ok).json({ ok: true, ...result });
}
async function removeItem(req, res) {
    await (0, admin_service_1.deleteAdminItem)(String(req.params.id));
    res.status(http_1.HTTP.ok).json({ ok: true, message: "Item archived" });
}
async function charts(_req, res) {
    const data = await (0, admin_service_1.getAdminCharts)();
    res.status(http_1.HTTP.ok).json({ ok: true, data });
}
