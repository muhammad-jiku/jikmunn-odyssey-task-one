import { Schema, model } from "mongoose";

export type ContactMessageStatus = "unread" | "read" | "resolved";

export interface ContactMessageDoc {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<ContactMessageDoc>(
  {
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
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });

export const ContactMessageModel = model<ContactMessageDoc>(
  "ContactMessage",
  contactMessageSchema
);
