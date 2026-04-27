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

// Hosts that match next.config.ts > images.remotePatterns. For any other
// host (typically a user-supplied URL) we render the image with `unoptimized`
// so the Next.js Image component doesn't reject it at runtime.
const OPTIMIZED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "picsum.photos",
  "fastly.picsum.photos",
]);

export function shouldUnoptimizeImage(src: string | undefined | null): boolean {
  if (!src) return true;
  if (src.startsWith("data:")) return true;
  try {
    const host = new URL(src).hostname;
    return !OPTIMIZED_IMAGE_HOSTS.has(host);
  } catch {
    return true;
  }
}
