"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminOverview = getAdminOverview;
exports.getAdminUsers = getAdminUsers;
exports.updateAdminUserRole = updateAdminUserRole;
exports.getAdminItems = getAdminItems;
exports.deleteAdminItem = deleteAdminItem;
exports.getAdminCharts = getAdminCharts;
const contact_message_model_1 = require("../models/contact-message.model");
const item_model_1 = require("../models/item.model");
const user_model_1 = require("../models/user.model");
const http_1 = require("../utils/http");
function toUserView(doc) {
    return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        avatarUrl: doc.avatarUrl,
        createdAt: doc.createdAt.toISOString()
    };
}
function toItemView(doc) {
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
async function getAdminOverview() {
    const [totalUsers, totalItems, totalActiveItems, totalContactMessages] = await Promise.all([
        user_model_1.UserModel.countDocuments({}),
        item_model_1.ItemModel.countDocuments({}),
        item_model_1.ItemModel.countDocuments({ status: "active" }),
        contact_message_model_1.ContactMessageModel.countDocuments({})
    ]);
    return {
        totalUsers,
        totalItems,
        totalActiveItems,
        totalContactMessages
    };
}
async function getAdminUsers(query) {
    const filter = {};
    if (query.role !== "all") {
        filter.role = query.role;
    }
    if (query.q) {
        filter.$or = [
            { name: { $regex: query.q, $options: "i" } },
            { email: { $regex: query.q, $options: "i" } }
        ];
    }
    const sort = query.sort === "name"
        ? { name: 1 }
        : query.sort === "email"
            ? { email: 1 }
            : query.sort === "role"
                ? { role: 1, createdAt: -1 }
                : { createdAt: -1 };
    const total = await user_model_1.UserModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, totalPages);
    const docs = await user_model_1.UserModel.find(filter)
        .sort(sort)
        .skip((page - 1) * query.pageSize)
        .limit(query.pageSize)
        .exec();
    return {
        rows: docs.map((doc) => toUserView(doc)),
        page,
        pageSize: query.pageSize,
        total,
        totalPages
    };
}
async function updateAdminUserRole(userId, payload) {
    const user = await user_model_1.UserModel.findById(userId).exec();
    if (!user) {
        throw new http_1.ApiError(http_1.HTTP.notFound, "User not found");
    }
    user.role = payload.role;
    await user.save();
    return toUserView(user);
}
async function getAdminItems(query) {
    const filter = {};
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
    const sort = query.sort === "price-asc"
        ? { price: 1, createdAt: -1 }
        : query.sort === "price-desc"
            ? { price: -1, createdAt: -1 }
            : query.sort === "rating-desc"
                ? { rating: -1, createdAt: -1 }
                : { createdAt: -1 };
    const total = await item_model_1.ItemModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, totalPages);
    const docs = await item_model_1.ItemModel.find(filter)
        .sort(sort)
        .skip((page - 1) * query.pageSize)
        .limit(query.pageSize)
        .exec();
    return {
        rows: docs.map((doc) => toItemView(doc)),
        page,
        pageSize: query.pageSize,
        total,
        totalPages
    };
}
async function deleteAdminItem(itemId) {
    const item = await item_model_1.ItemModel.findById(itemId).exec();
    if (!item) {
        throw new http_1.ApiError(http_1.HTTP.notFound, "Item not found");
    }
    item.status = "archived";
    await item.save();
}
function monthLabel(date) {
    return date.toISOString().slice(0, 7);
}
async function getAdminCharts() {
    const now = new Date();
    const monthStarts = Array.from({ length: 6 }).map((_, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        return d;
    });
    const monthItems = await Promise.all(monthStarts.map(async (start, index) => {
        const end = index === monthStarts.length - 1
            ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
            : monthStarts[index + 1];
        const [items, messages] = await Promise.all([
            item_model_1.ItemModel.countDocuments({ createdAt: { $gte: start, $lt: end } }),
            contact_message_model_1.ContactMessageModel.countDocuments({ createdAt: { $gte: start, $lt: end } })
        ]);
        return {
            month: monthLabel(start),
            items,
            messages
        };
    }));
    const [categoryRows, roleRows, messageStatusRows] = await Promise.all([
        item_model_1.ItemModel.aggregate([
            { $match: { status: "active" } },
            { $group: { _id: "$category", value: { $sum: 1 } } },
            { $sort: { value: -1 } }
        ]),
        user_model_1.UserModel.aggregate([
            { $group: { _id: "$role", value: { $sum: 1 } } },
            { $sort: { value: -1 } }
        ]),
        contact_message_model_1.ContactMessageModel.aggregate([
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
