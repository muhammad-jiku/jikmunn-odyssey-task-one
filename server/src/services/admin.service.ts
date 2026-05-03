import type { FilterQuery } from "mongoose";
import { ContactMessageModel } from "../models/contact-message.model";
import { ItemModel, type ItemDoc } from "../models/item.model";
import { UserModel, type UserDoc, type UserRole } from "../models/user.model";
import { ApiError, HTTP } from "../utils/http";
import type { ItemsAdminQueryInput, UpdateUserRoleInput, UsersQueryInput } from "../validators/admin.validator";

interface AdminUserView {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

interface AdminItemView {
  id: string;
  title: string;
  category: ItemDoc["category"];
  price: number;
  rating: number;
  status: ItemDoc["status"];
  createdAt: string;
  ownerId: string;
}

interface Paginated<T> {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function toUserView(doc: UserDoc & { _id: { toString(): string } }): AdminUserView {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatarUrl: doc.avatarUrl,
    createdAt: doc.createdAt.toISOString()
  };
}

function toItemView(doc: ItemDoc & { _id: { toString(): string } }): AdminItemView {
  return {
    id: doc._id.toString(),
    title: doc.title,
    category: doc.category,
    price: doc.price,
    rating: doc.rating,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    ownerId: doc.ownerId.toString()
  };
}

export async function getAdminOverview() {
  const [totalUsers, totalItems, totalActiveItems, totalContactMessages] = await Promise.all([
    UserModel.countDocuments({}),
    ItemModel.countDocuments({}),
    ItemModel.countDocuments({ status: "active" }),
    ContactMessageModel.countDocuments({})
  ]);

  return {
    totalUsers,
    totalItems,
    totalActiveItems,
    totalContactMessages
  };
}

export async function getAdminUsers(query: UsersQueryInput): Promise<Paginated<AdminUserView>> {
  const filter: FilterQuery<UserDoc> = {};

  if (query.role !== "all") {
    filter.role = query.role;
  }

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { email: { $regex: query.q, $options: "i" } }
    ];
  }

  const sort: Record<string, 1 | -1> =
    query.sort === "name"
      ? { name: 1 }
      : query.sort === "email"
      ? { email: 1 }
      : query.sort === "role"
      ? { role: 1, createdAt: -1 }
      : { createdAt: -1 };

  const total = await UserModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);

  const docs = await UserModel.find(filter)
    .sort(sort)
    .skip((page - 1) * query.pageSize)
    .limit(query.pageSize)
    .exec();

  return {
    rows: docs.map((doc) => toUserView(doc as UserDoc & { _id: { toString(): string } })),
    page,
    pageSize: query.pageSize,
    total,
    totalPages
  };
}

export async function updateAdminUserRole(
  userId: string,
  payload: UpdateUserRoleInput
): Promise<AdminUserView> {
  const user = await UserModel.findById(userId).exec();
  if (!user) {
    throw new ApiError(HTTP.notFound, "User not found");
  }

  user.role = payload.role;
  await user.save();
  return toUserView(user as UserDoc & { _id: { toString(): string } });
}

export async function getAdminItems(query: ItemsAdminQueryInput): Promise<Paginated<AdminItemView>> {
  const filter: FilterQuery<ItemDoc> = {};

  if (query.status !== "all") {
    filter.status = query.status;
  }

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { shortDescription: { $regex: query.q, $options: "i" } },
      { fullDescription: { $regex: query.q, $options: "i" } }
    ];
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

  const docs = await ItemModel.find(filter)
    .sort(sort)
    .skip((page - 1) * query.pageSize)
    .limit(query.pageSize)
    .exec();

  return {
    rows: docs.map((doc) => toItemView(doc as ItemDoc & { _id: { toString(): string } })),
    page,
    pageSize: query.pageSize,
    total,
    totalPages
  };
}

export async function deleteAdminItem(itemId: string): Promise<void> {
  const item = await ItemModel.findById(itemId).exec();
  if (!item) {
    throw new ApiError(HTTP.notFound, "Item not found");
  }

  item.status = "archived";
  await item.save();
}

function monthLabel(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export async function getAdminCharts() {
  const now = new Date();
  const monthStarts = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return d;
  });

  const monthItems = await Promise.all(
    monthStarts.map(async (start, index) => {
      const end =
        index === monthStarts.length - 1
          ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
          : monthStarts[index + 1];

      const [items, messages] = await Promise.all([
        ItemModel.countDocuments({ createdAt: { $gte: start, $lt: end } }),
        ContactMessageModel.countDocuments({ createdAt: { $gte: start, $lt: end } })
      ]);

      return {
        month: monthLabel(start),
        items,
        messages
      };
    })
  );

  const [categoryRows, roleRows, messageStatusRows] = await Promise.all([
    ItemModel.aggregate<{ _id: string; value: number }>([
      { $match: { status: "active" } },
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ]),
    UserModel.aggregate<{ _id: string; value: number }>([
      { $group: { _id: "$role", value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ]),
    ContactMessageModel.aggregate<{ _id: string; value: number }>([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ])
  ]);

  return {
    itemsAndMessagesByMonth: monthItems,
    categoryDistribution: categoryRows.map((row) => ({ label: row._id, value: row.value })),
    roleDistribution: roleRows.map((row) => ({ label: row._id, value: row.value })),
    messageStatusDistribution: messageStatusRows.map((row) => ({ label: row._id, value: row.value }))
  };
}
