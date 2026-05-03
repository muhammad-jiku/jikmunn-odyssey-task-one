"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessageModel = void 0;
const mongoose_1 = require("mongoose");
const contactMessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    subject: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    status: {
        type: String,
        enum: ["unread", "read", "resolved"],
        default: "unread",
        index: true
    }
}, { timestamps: true });
contactMessageSchema.index({ createdAt: -1 });
exports.ContactMessageModel = (0, mongoose_1.model)("ContactMessage", contactMessageSchema);
