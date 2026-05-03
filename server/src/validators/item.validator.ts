import { z } from "zod";

const categorySchema = z.enum([
  "electronics",
  "fashion",
  "home",
  "books",
  "sports",
  "beauty"
]);

const imageUrlSchema = z.string().url().trim().min(1);

export const createItemSchema = z.object({
  title: z.string().min(3).max(120),
  shortDescription: z.string().min(10).max(200),
  fullDescription: z.string().min(20).max(5000),
  price: z.coerce.number().min(0).max(1000000),
  category: categorySchema,
  rating: z.coerce.number().min(0).max(5).default(4.5),
  imageUrl: imageUrlSchema.optional(),
  images: z.array(imageUrlSchema).min(2).optional()
});

export const updateItemSchema = createItemSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field is required"
);

export const itemsQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: categorySchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z
    .enum(["featured", "price-asc", "price-desc", "rating-desc", "newest"])
    .default("featured"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  owner: z.enum(["all", "me"]).default("all")
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemsQueryInput = z.infer<typeof itemsQuerySchema>;
