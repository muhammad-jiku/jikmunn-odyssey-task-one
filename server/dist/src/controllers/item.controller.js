"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const http_1 = require("../utils/http");
const item_service_1 = require("../services/item.service");
const item_validator_1 = require("../validators/item.validator");
async function list(req, res) {
    const query = item_validator_1.itemsQuerySchema.parse(req.query);
    if (query.owner === "me" && !req.auth?.userId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const ownerId = query.owner === "me" ? req.auth?.userId : undefined;
    const result = await (0, item_service_1.listItems)(query, ownerId);
    res.status(http_1.HTTP.ok).json({ ok: true, ...result });
}
async function getById(req, res) {
    const item = await (0, item_service_1.getItemById)(String(req.params.id));
    res.status(http_1.HTTP.ok).json({ ok: true, item });
}
async function create(req, res) {
    const payload = item_validator_1.createItemSchema.parse(req.body);
    const ownerId = req.auth?.userId;
    if (!ownerId) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const item = await (0, item_service_1.createItem)(payload, ownerId);
    res.status(http_1.HTTP.created).json({ ok: true, item });
}
async function update(req, res) {
    const payload = item_validator_1.updateItemSchema.parse(req.body);
    const auth = req.auth;
    if (!auth) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    const item = await (0, item_service_1.updateItem)(String(req.params.id), payload, {
        userId: auth.userId,
        role: auth.role
    });
    res.status(http_1.HTTP.ok).json({ ok: true, item });
}
async function remove(req, res) {
    const auth = req.auth;
    if (!auth) {
        res.status(http_1.HTTP.unauthorized).json({ ok: false, message: "Authentication required" });
        return;
    }
    await (0, item_service_1.deleteItem)(String(req.params.id), { userId: auth.userId, role: auth.role });
    res.status(http_1.HTTP.ok).json({ ok: true, message: "Item deleted" });
}
