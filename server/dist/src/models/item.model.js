"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    shortDescription: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 200
    },
    fullDescription: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 5000
    },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ["electronics", "fashion", "home", "books", "sports", "beauty"],
        index: true
    },
    rating: { type: Number, required: true, min: 0, max: 5, default: 4.5 },
    images: { type: [String], default: [] },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["active", "archived"], default: "active", index: true }
}, { timestamps: true });
itemSchema.index({ title: "text", shortDescription: "text", fullDescription: "text" });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ price: 1 });
itemSchema.index({ rating: -1 });
exports.ItemModel = (0, mongoose_1.model)("Item", itemSchema);
