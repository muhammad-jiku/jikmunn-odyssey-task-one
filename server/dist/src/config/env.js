"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    MONGODB_URI: zod_1.z.string().min(1, "MONGODB_URI is required"),
    CORS_ORIGIN: zod_1.z.string().min(1, "CORS_ORIGIN is required"),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16, "JWT_ACCESS_SECRET is required (min 16 chars)"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, "JWT_REFRESH_SECRET is required (min 16 chars)"),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("7d"),
    DEMO_ADMIN_NAME: zod_1.z.string().default("Admin Demo"),
    DEMO_ADMIN_EMAIL: zod_1.z.string().email().default("admin@odyssey.dev"),
    DEMO_ADMIN_PASSWORD: zod_1.z.string().min(6).default("AdminDemo123!"),
    DEMO_USER_NAME: zod_1.z.string().default("User Demo"),
    DEMO_USER_EMAIL: zod_1.z.string().email().default("user@odyssey.dev"),
    DEMO_USER_PASSWORD: zod_1.z.string().min(6).default("UserDemo123!")
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const issues = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
        .join("; ");
    throw new Error(`Invalid server environment variables: ${issues}`);
}
exports.env = parsed.data;
