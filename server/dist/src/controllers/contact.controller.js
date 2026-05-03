"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.list = list;
const http_1 = require("../utils/http");
const contact_service_1 = require("../services/contact.service");
const contact_validator_1 = require("../validators/contact.validator");
async function create(req, res) {
    const payload = contact_validator_1.createContactMessageSchema.parse(req.body);
    const message = await (0, contact_service_1.createContactMessage)(payload);
    res.status(http_1.HTTP.created).json({ ok: true, message: "Message submitted", contact: message });
}
async function list(req, res) {
    const query = contact_validator_1.contactMessagesQuerySchema.parse(req.query);
    const result = await (0, contact_service_1.listContactMessages)(query);
    res.status(http_1.HTTP.ok).json({ ok: true, ...result });
}
