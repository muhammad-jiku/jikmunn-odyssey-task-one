import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000)
});

export const contactMessagesQuerySchema = z.object({
  status: z.enum(["all", "unread", "read", "resolved"]).default("all"),
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type ContactMessagesQueryInput = z.infer<typeof contactMessagesQuerySchema>;
