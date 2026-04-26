export type ItemCategory =
  | "electronics"
  | "fashion"
  | "home"
  | "books"
  | "sports"
  | "beauty";

export interface Item {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: ItemCategory;
  rating: number;
  imageUrl?: string;
  createdAt: string;
  ownerId?: string;
}
