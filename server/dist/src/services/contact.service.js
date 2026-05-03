"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactMessage = createContactMessage;
exports.listContactMessages = listContactMessages;
const contact_message_model_1 = require("../models/contact-message.model");
function toView(doc) {
    return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        message: doc.message,
        status: doc.status,
        createdAt: doc.createdAt.toISOString()
    };
}
async function createContactMessage(input) {
    const doc = await contact_message_model_1.ContactMessageModel.create({
        name: input.name,
        email: input.email.toLowerCase(),
        subject: input.subject,
        message: input.message,
        status: "unread"
    });
    return toView(doc);
}
async function listContactMessages(query) {
    const filter = {};
    if (query.status !== "all") {
        filter.status = query.status;
    }
    if (query.q) {
        filter.$or = [
            { name: { $regex: query.q, $options: "i" } },
            { email: { $regex: query.q, $options: "i" } },
            { subject: { $regex: query.q, $options: "i" } },
            { message: { $regex: query.q, $options: "i" } }
        ];
    }
    const total = await contact_message_model_1.ContactMessageModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, totalPages);
    const docs = await contact_message_model_1.ContactMessageModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * query.pageSize)
        .limit(query.pageSize)
        .exec();
    return {
        messages: docs.map((doc) => toView(doc)),
        page,
        pageSize: query.pageSize,
        total,
        totalPages
    };
}
