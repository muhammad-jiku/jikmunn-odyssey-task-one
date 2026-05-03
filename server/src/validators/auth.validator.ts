import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(128)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
});

export const demoLoginSchema = z.object({
  role: z.enum(["user", "admin"]).optional()
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(10)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DemoLoginInput = z.infer<typeof demoLoginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
