import type { FilterQuery } from "mongoose";
import { ItemModel, type ItemDoc } from "../models/item.model";
import type { UserRole } from "../models/user.model";
import { ApiError, HTTP } from "../utils/http";
import type { CreateItemInput, ItemsQueryInput, UpdateItemInput } from "../validators/item.validator";

export interface ItemView {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: ItemDoc["category"];
  rating: number;
  imageUrl?: string;
  images: string[];
  createdAt: string;
  ownerId: string;
}

interface ListResult {
  items: ItemView[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function normalizeImages(images?: string[], imageUrl?: string): string[] {
  if (images && images.length > 0) return images;
  if (imageUrl) return [imageUrl];
  return [];
}

function toView(doc: ItemDoc & { _id: { toString(): string } }): ItemView {
  return {
    id: doc._id.toString(),
    title: doc.title,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    price: doc.price,
    category: doc.category,
    rating: doc.rating,
    images: doc.images,
    imageUrl: doc.images[0],
    createdAt: doc.createdAt.toISOString(),
    ownerId: doc.ownerId.toString()
  };
}

export async function listItems(query: ItemsQueryInput, ownerId?: string): Promise<ListResult> {
  const filter: FilterQuery<ItemDoc> = { status: "active" };

  if (ownerId) {
    filter.ownerId = ownerId;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
    if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
  }

  if (query.q) {
    filter.$text = { $search: query.q };
  }

  const sort: Record<string, 1 | -1> =
    query.sort === "price-asc"
      ? { price: 1, createdAt: -1 }
      : query.sort === "price-desc"
      ? { price: -1, createdAt: -1 }
      : query.sort === "rating-desc"
      ? { rating: -1, createdAt: -1 }
      : { createdAt: -1 };

  const total = await ItemModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const skip = (page - 1) * query.pageSize;

  const docs = await ItemModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(query.pageSize)
    .exec();

  return {
    items: docs.map((doc) => toView(doc as ItemDoc & { _id: { toString(): string } })),
    page,
    pageSize: query.pageSize,
    total,
    totalPages
  };
}

export async function getItemById(id: string): Promise<ItemView> {
  const doc = await ItemModel.findById(id).exec();
  if (!doc || doc.status !== "active") {
    throw new ApiError(HTTP.notFound, "Item not found");
  }
  return toView(doc as ItemDoc & { _id: { toString(): string } });
}

export async function createItem(input: CreateItemInput, ownerId: string): Promise<ItemView> {
  const images = normalizeImages(input.images, input.imageUrl);
  const doc = await ItemModel.create({
    title: input.title,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    price: input.price,
    category: input.category,
    rating: input.rating,
    images,
    ownerId,
    status: "active"
  });

  return toView(doc as ItemDoc & { _id: { toString(): string } });
}

export async function updateItem(
  id: string,
  input: UpdateItemInput,
  actor: { userId: string; role: UserRole }
): Promise<ItemView> {
  const doc = await ItemModel.findById(id).exec();
  if (!doc || doc.status !== "active") {
    throw new ApiError(HTTP.notFound, "Item not found");
  }

  if (actor.role !== "admin" && doc.ownerId.toString() !== actor.userId) {
    throw new ApiError(HTTP.forbidden, "You can only edit your own items");
  }

  if (input.title !== undefined) doc.title = input.title;
  if (input.shortDescription !== undefined) doc.shortDescription = input.shortDescription;
  if (input.fullDescription !== undefined) doc.fullDescription = input.fullDescription;
  if (input.price !== undefined) doc.price = input.price;
  if (input.category !== undefined) doc.category = input.category;
  if (input.rating !== undefined) doc.rating = input.rating;
  if (input.images !== undefined || input.imageUrl !== undefined) {
    doc.images = normalizeImages(input.images, input.imageUrl);
  }

  await doc.save();
  return toView(doc as ItemDoc & { _id: { toString(): string } });
}

export async function deleteItem(
  id: string,
  actor: { userId: string; role: UserRole }
): Promise<void> {
  const doc = await ItemModel.findById(id).exec();
  if (!doc || doc.status !== "active") {
    throw new ApiError(HTTP.notFound, "Item not found");
  }

  if (actor.role !== "admin" && doc.ownerId.toString() !== actor.userId) {
    throw new ApiError(HTTP.forbidden, "You can only delete your own items");
  }

  doc.status = "archived";
  await doc.save();
}
