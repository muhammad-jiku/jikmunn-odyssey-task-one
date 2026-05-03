"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatarSchema = exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(2).max(120).optional(),
    email: zod_1.z.string().trim().email().optional()
})
    .refine((value) => value.name !== undefined || value.email !== undefined, {
    message: "At least one profile field is required"
});
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(6).max(128),
    newPassword: zod_1.z.string().min(6).max(128)
})
    .refine((value) => value.currentPassword !== value.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
});
exports.updateAvatarSchema = zod_1.z.object({
    avatarUrl: zod_1.z.string().trim().url().max(1000)
});
