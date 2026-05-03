"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.itemsAdminQuerySchema = exports.usersQuerySchema = void 0;
const zod_1 = require("zod");
exports.usersQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().optional(),
    role: zod_1.z.enum(["all", "user", "admin"]).default("all"),
    sort: zod_1.z.enum(["newest", "name", "email", "role"]).default("newest"),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20)
});
exports.itemsAdminQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().optional(),
    status: zod_1.z.enum(["all", "active", "archived"]).default("all"),
    sort: zod_1.z.enum(["newest", "price-asc", "price-desc", "rating-desc"]).default("newest"),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20)
});
exports.updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["user", "admin"])
});
