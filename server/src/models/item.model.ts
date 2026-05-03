import { Schema, model, type Types } from "mongoose";

export type ItemCategory =
  | "electronics"
  | "fashion"
  | "home"
  | "books"
  | "sports"
  | "beauty";

export interface ItemDoc {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: ItemCategory;
  rating: number;
  images: string[];
  ownerId: Types.ObjectId;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<ItemDoc>(
  {
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
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["active", "archived"], default: "active", index: true }
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", shortDescription: "text", fullDescription: "text" });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ price: 1 });
itemSchema.index({ rating: -1 });

export const ItemModel = model<ItemDoc>("Item", itemSchema);
