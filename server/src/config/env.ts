import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET is required (min 16 chars)"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET is required (min 16 chars)"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  DEMO_ADMIN_NAME: z.string().default("Admin Demo"),
  DEMO_ADMIN_EMAIL: z.string().email().default("admin@odyssey.dev"),
  DEMO_ADMIN_PASSWORD: z.string().min(6).default("AdminDemo123!"),
  DEMO_USER_NAME: z.string().default("User Demo"),
  DEMO_USER_EMAIL: z.string().email().default("user@odyssey.dev"),
  DEMO_USER_PASSWORD: z.string().min(6).default("UserDemo123!")
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid server environment variables: ${issues}`);
}

export const env = parsed.data;
