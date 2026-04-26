import type { ItemCategory } from "@/types/item";

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  home: "Home",
  books: "Books",
  sports: "Sports",
  beauty: "Beauty",
};

export const ALL_CATEGORIES: ItemCategory[] = [
  "electronics",
  "fashion",
  "home",
  "books",
  "sports",
  "beauty",
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}
