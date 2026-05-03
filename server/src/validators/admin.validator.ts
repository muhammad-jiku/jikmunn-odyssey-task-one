import { z } from "zod";

export const usersQuerySchema = z.object({
  q: z.string().trim().optional(),
  role: z.enum(["all", "user", "admin"]).default("all"),
  sort: z.enum(["newest", "name", "email", "role"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export const itemsAdminQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(["all", "active", "archived"]).default("all"),
  sort: z.enum(["newest", "price-asc", "price-desc", "rating-desc"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["user", "admin"])
});

export type UsersQueryInput = z.infer<typeof usersQuerySchema>;
export type ItemsAdminQueryInput = z.infer<typeof itemsAdminQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
