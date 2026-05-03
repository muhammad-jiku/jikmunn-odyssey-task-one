"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMessagesQuerySchema = exports.createContactMessageSchema = void 0;
const zod_1 = require("zod");
exports.createContactMessageSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(120),
    email: zod_1.z.string().trim().email(),
    subject: zod_1.z.string().trim().min(2).max(120),
    message: zod_1.z.string().trim().min(10).max(2000)
});
exports.contactMessagesQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(["all", "unread", "read", "resolved"]).default("all"),
    q: zod_1.z.string().trim().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20)
});
