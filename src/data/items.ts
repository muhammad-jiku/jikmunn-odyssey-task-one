import type { Item } from "@/types/item";

// Each image is a hand-picked Unsplash photo ID that depicts the product.
// `images.unsplash.com` is allow-listed in `next.config.ts`.
const u = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;

export const staticItems: Item[] = [
  // ---------------- Electronics ----------------
  {
    id: "static-1",
    title: "Aurora Wireless Headphones",
    shortDescription: "Immersive sound with active noise cancellation.",
    fullDescription:
      "Aurora delivers studio-grade audio with adaptive ANC, 40-hour battery life, and plush memory-foam cushions for all-day comfort.",
    price: 199,
    category: "electronics",
    rating: 4.7,
    imageUrl: u("1505740420928-5e560c06d30e"),
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "static-7",
    title: "Pulse Smart Watch",
    shortDescription: "Health tracking with always-on AMOLED.",
    fullDescription:
      "Track sleep, heart rate, and 100+ workouts with a sapphire crystal display and a 7-day battery in a 39 g titanium case.",
    price: 249,
    category: "electronics",
    rating: 4.6,
    imageUrl: u("1523275335684-37898b6baf30"),
    createdAt: "2026-01-15T10:00:00.000Z",
  },

  // ---------------- Fashion ----------------
  {
    id: "static-2",
    title: "Linen Field Shirt",
    shortDescription: "Breathable everyday shirt in warm earth tones.",
    fullDescription:
      "Crafted from 100% European linen with a relaxed fit and reinforced stitching, perfect for travel and weekend wear.",
    price: 79,
    category: "fashion",
    rating: 4.4,
    imageUrl: u("1564859228273-274232fdb516"),
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "static-11",
    title: "Everyday Selvedge Jeans",
    shortDescription: "13.5 oz Japanese denim with a modern straight fit.",
    fullDescription:
      "Loomed in Okayama and finished in-house with chain-stitched hems and a hidden coin pocket. They get better with every wear.",
    price: 149,
    category: "fashion",
    rating: 4.5,
    imageUrl: u("1542272604-787c3835535d"),
    createdAt: "2026-02-15T10:00:00.000Z",
  },

  // ---------------- Home ----------------
  {
    id: "static-3",
    title: "Nordic Oak Desk Lamp",
    shortDescription: "Minimalist task lamp with warm dimmable LED.",
    fullDescription:
      "Solid oak base with brushed aluminum arm. Three brightness levels and a USB-C charging port keep your desk clean and capable.",
    price: 129,
    category: "home",
    rating: 4.6,
    imageUrl: u("1513506003901-1e6a229e2d15"),
    createdAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "static-13",
    title: "Stoneware Pour-Over Set",
    shortDescription: "Hand-thrown dripper, server, and mug trio.",
    fullDescription:
      "A complete morning ritual in matte clay. Brews a rich 600 ml carafe and feels great in the hand on cold mornings.",
    price: 119,
    category: "home",
    rating: 4.7,
    imageUrl: u("1495474472287-4d71bcdd2085"),
    createdAt: "2026-02-24T10:00:00.000Z",
  },

  // ---------------- Books ----------------
  {
    id: "static-4",
    title: "Atlas: A Designer's Guide",
    shortDescription: "A modern handbook for visual systems and brand design.",
    fullDescription:
      "Over 320 pages of frameworks, case studies, and exercises from leading studios. Hardcover with thread-sewn binding.",
    price: 39,
    category: "books",
    rating: 4.8,
    imageUrl: u("1512820790803-83ca734da794"),
    createdAt: "2026-03-01T10:00:00.000Z",
  },

  // ---------------- Sports ----------------
  {
    id: "static-5",
    title: "TrailRun Pro Sneakers",
    shortDescription: "Lightweight trail runners with grip-lock outsole.",
    fullDescription:
      "Engineered for mixed terrain with breathable mesh, EVA midsole cushioning, and a Vibram-style multi-direction lug pattern.",
    price: 149,
    category: "sports",
    rating: 4.5,
    imageUrl: u("1542291026-7eec264c27ff"),
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "static-20",
    title: "Cork Yoga Mat",
    shortDescription: "5 mm natural cork over recycled rubber.",
    fullDescription:
      "Naturally antibacterial with a non-slip grip that improves with sweat. Ships with a woven carry strap.",
    price: 79,
    category: "sports",
    rating: 4.5,
    imageUrl: u("1545205597-3d9d02c29597"),
    createdAt: "2026-03-19T10:00:00.000Z",
  },

  // ---------------- Beauty ----------------
  {
    id: "static-6",
    title: "Botanic Glow Serum",
    shortDescription: "Vitamin C + hyaluronic acid daily radiance serum.",
    fullDescription:
      "A lightweight, fragrance-free serum that brightens, hydrates, and supports the skin barrier. Dermatologist tested.",
    price: 49,
    category: "beauty",
    rating: 4.3,
    imageUrl: u("1556228720-195a672e8a03"),
    createdAt: "2026-03-25T10:00:00.000Z",
  },
];
