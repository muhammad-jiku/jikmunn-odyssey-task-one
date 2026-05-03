"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listItems = listItems;
exports.getItemById = getItemById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
const item_model_1 = require("../models/item.model");
const http_1 = require("../utils/http");
function normalizeImages(images, imageUrl) {
    if (images && images.length > 0)
        return images;
    if (imageUrl)
        return [imageUrl];
    return [];
}
function toView(doc) {
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
async function listItems(query, ownerId) {
    const filter = { status: "active" };
    if (ownerId) {
        filter.ownerId = ownerId;
    }
    if (query.category) {
        filter.category = query.category;
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        filter.price = {};
        if (query.minPrice !== undefined)
            filter.price.$gte = query.minPrice;
        if (query.maxPrice !== undefined)
            filter.price.$lte = query.maxPrice;
    }
    if (query.q) {
        filter.$text = { $search: query.q };
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
    const skip = (page - 1) * query.pageSize;
    const docs = await item_model_1.ItemModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(query.pageSize)
        .exec();
    return {
        items: docs.map((doc) => toView(doc)),
        page,
        pageSize: query.pageSize,
        total,
        totalPages
    };
}
async function getItemById(id) {
    const doc = await item_model_1.ItemModel.findById(id).exec();
    if (!doc || doc.status !== "active") {
        throw new http_1.ApiError(http_1.HTTP.notFound, "Item not found");
    }
    return toView(doc);
}
async function createItem(input, ownerId) {
    const images = normalizeImages(input.images, input.imageUrl);
    const doc = await item_model_1.ItemModel.create({
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
    return toView(doc);
}
async function updateItem(id, input, actor) {
    const doc = await item_model_1.ItemModel.findById(id).exec();
    if (!doc || doc.status !== "active") {
        throw new http_1.ApiError(http_1.HTTP.notFound, "Item not found");
    }
    if (actor.role !== "admin" && doc.ownerId.toString() !== actor.userId) {
        throw new http_1.ApiError(http_1.HTTP.forbidden, "You can only edit your own items");
    }
    if (input.title !== undefined)
        doc.title = input.title;
    if (input.shortDescription !== undefined)
        doc.shortDescription = input.shortDescription;
    if (input.fullDescription !== undefined)
        doc.fullDescription = input.fullDescription;
    if (input.price !== undefined)
        doc.price = input.price;
    if (input.category !== undefined)
        doc.category = input.category;
    if (input.rating !== undefined)
        doc.rating = input.rating;
    if (input.images !== undefined || input.imageUrl !== undefined) {
        doc.images = normalizeImages(input.images, input.imageUrl);
    }
    await doc.save();
    return toView(doc);
}
async function deleteItem(id, actor) {
    const doc = await item_model_1.ItemModel.findById(id).exec();
    if (!doc || doc.status !== "active") {
        throw new http_1.ApiError(http_1.HTTP.notFound, "Item not found");
    }
    if (actor.role !== "admin" && doc.ownerId.toString() !== actor.userId) {
        throw new http_1.ApiError(http_1.HTTP.forbidden, "You can only delete your own items");
    }
    doc.status = "archived";
    await doc.save();
}
