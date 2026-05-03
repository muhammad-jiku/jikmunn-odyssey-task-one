import type { FilterQuery } from "mongoose";
import { ContactMessageModel, type ContactMessageDoc } from "../models/contact-message.model";
import type { ContactMessagesQueryInput, CreateContactMessageInput } from "../validators/contact.validator";

export interface ContactMessageView {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
}

interface ContactMessagesResult {
  messages: ContactMessageView[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function toView(doc: ContactMessageDoc & { _id: { toString(): string } }): ContactMessageView {
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

export async function createContactMessage(
  input: CreateContactMessageInput
): Promise<ContactMessageView> {
  const doc = await ContactMessageModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    subject: input.subject,
    message: input.message,
    status: "unread"
  });

  return toView(doc as ContactMessageDoc & { _id: { toString(): string } });
}

export async function listContactMessages(
  query: ContactMessagesQueryInput
): Promise<ContactMessagesResult> {
  const filter: FilterQuery<ContactMessageDoc> = {};

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

  const total = await ContactMessageModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);

  const docs = await ContactMessageModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * query.pageSize)
    .limit(query.pageSize)
    .exec();

  return {
    messages: docs.map((doc) => toView(doc as ContactMessageDoc & { _id: { toString(): string } })),
    page,
    pageSize: query.pageSize,
    total,
    totalPages
  };
}
