"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsQuerySchema = exports.updateItemSchema = exports.createItemSchema = void 0;
const zod_1 = require("zod");
const categorySchema = zod_1.z.enum([
    "electronics",
    "fashion",
    "home",
    "books",
    "sports",
    "beauty"
]);
const imageUrlSchema = zod_1.z.string().url().trim().min(1);
exports.createItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(120),
    shortDescription: zod_1.z.string().min(10).max(200),
    fullDescription: zod_1.z.string().min(20).max(5000),
    price: zod_1.z.coerce.number().min(0).max(1000000),
    category: categorySchema,
    rating: zod_1.z.coerce.number().min(0).max(5).default(4.5),
    imageUrl: imageUrlSchema.optional(),
    images: zod_1.z.array(imageUrlSchema).min(2).optional()
});
exports.updateItemSchema = exports.createItemSchema.partial().refine((data) => Object.keys(data).length > 0, "At least one field is required");
exports.itemsQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().optional(),
    category: categorySchema.optional(),
    minPrice: zod_1.z.coerce.number().min(0).optional(),
    maxPrice: zod_1.z.coerce.number().min(0).optional(),
    sort: zod_1.z
        .enum(["featured", "price-asc", "price-desc", "rating-desc", "newest"])
        .default("featured"),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(24),
    owner: zod_1.z.enum(["all", "me"]).default("all")
});
