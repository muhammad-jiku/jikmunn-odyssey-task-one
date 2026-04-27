import type { Item } from "@/types/item";

// Image URLs use picsum.photos with deterministic seeds so they never 404
// and stay stable across builds. The hostname is allow-listed in
// `next.config.ts` and treated as optimizable by `shouldUnoptimizeImage`.
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

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
    imageUrl: img("aurora-headphones"),
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
    imageUrl: img("pulse-watch"),
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "static-8",
    title: "Lumen 4K Action Camera",
    shortDescription: "Pocketable 4K60 with built-in stabilization.",
    fullDescription:
      "Capture cinematic adventures with HyperSteady stabilization, 10 m waterproofing, and dual-screen framing for vlogs.",
    price: 329,
    category: "electronics",
    rating: 4.5,
    imageUrl: img("lumen-cam"),
    createdAt: "2026-01-22T10:00:00.000Z",
  },
  {
    id: "static-9",
    title: "Nimbus Mechanical Keyboard",
    shortDescription: "75% wireless board with hot-swap switches.",
    fullDescription:
      "Aluminum chassis, gasket-mounted PCB, and triple-mode connectivity (USB-C, BT 5.3, 2.4 GHz). Sounds great out of the box.",
    price: 169,
    category: "electronics",
    rating: 4.8,
    imageUrl: img("nimbus-keyboard"),
    createdAt: "2026-01-28T10:00:00.000Z",
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
    imageUrl: img("linen-shirt"),
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "static-10",
    title: "Heritage Wool Overcoat",
    shortDescription: "Tailored mid-length coat in slate herringbone.",
    fullDescription:
      "Made from a premium Italian wool blend with a satin lining and horn buttons. A timeless layer for transitional weather.",
    price: 389,
    category: "fashion",
    rating: 4.6,
    imageUrl: img("wool-overcoat"),
    createdAt: "2026-02-09T10:00:00.000Z",
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
    imageUrl: img("selvedge-jeans"),
    createdAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "static-12",
    title: "Stone Canvas Tote",
    shortDescription: "Heavyweight 18 oz canvas with leather handles.",
    fullDescription:
      'An everyday carry that wears in beautifully. Roomy enough for a 14" laptop, a paperback, and a thermos.',
    price: 89,
    category: "fashion",
    rating: 4.3,
    imageUrl: img("canvas-tote"),
    createdAt: "2026-02-19T10:00:00.000Z",
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
    imageUrl: img("oak-lamp"),
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
    imageUrl: img("pourover-set"),
    createdAt: "2026-02-24T10:00:00.000Z",
  },
  {
    id: "static-14",
    title: "Linen Throw Blanket",
    shortDescription: "Stonewashed linen-cotton throw in sand.",
    fullDescription:
      "Generously sized at 130 × 180 cm with hand-knotted fringe. Naturally cooling in summer, layers warmly in winter.",
    price: 99,
    category: "home",
    rating: 4.4,
    imageUrl: img("linen-throw"),
    createdAt: "2026-02-27T10:00:00.000Z",
  },
  {
    id: "static-15",
    title: "Walnut Wall Shelf",
    shortDescription: "Floating shelf with concealed bracket.",
    fullDescription:
      "FSC-certified American walnut, hand-finished with a hardwax oil. Holds up to 18 kg with the included steel mount.",
    price: 89,
    category: "home",
    rating: 4.5,
    imageUrl: img("walnut-shelf"),
    createdAt: "2026-03-01T10:00:00.000Z",
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
    imageUrl: img("atlas-book"),
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "static-16",
    title: "Quiet Engineering",
    shortDescription: "Essays on craft, focus, and small teams.",
    fullDescription:
      "Twenty-two essays on shipping software with intention. Cloth-bound with a sewn-in ribbon and a deckled fore-edge.",
    price: 29,
    category: "books",
    rating: 4.6,
    imageUrl: img("quiet-engineering"),
    createdAt: "2026-03-04T10:00:00.000Z",
  },
  {
    id: "static-17",
    title: "Field Notes: Pacific Trails",
    shortDescription: "Photo essay across 12 coastal hikes.",
    fullDescription:
      "Large-format hardcover printed on matte FSC paper, with hand-drawn route maps and tide-tested gear lists.",
    price: 49,
    category: "books",
    rating: 4.5,
    imageUrl: img("field-notes"),
    createdAt: "2026-03-07T10:00:00.000Z",
  },
  {
    id: "static-18",
    title: "Slow Cooking, Fast Lives",
    shortDescription: "80 weeknight recipes built around one pot.",
    fullDescription:
      "From dal to ragù, every recipe fits one pan and one hour. Includes a pull-out pantry chart and shopping templates.",
    price: 35,
    category: "books",
    rating: 4.4,
    imageUrl: img("slow-cooking"),
    createdAt: "2026-03-10T10:00:00.000Z",
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
    imageUrl: img("trailrun-pro"),
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "static-19",
    title: "Summit 28L Daypack",
    shortDescription: "Weather-sealed pack with hip-belt pockets.",
    fullDescription:
      "Recycled 420D ripstop with welded seams, a hydration sleeve, and load-stabilizing straps for all-day trails.",
    price: 139,
    category: "sports",
    rating: 4.6,
    imageUrl: img("summit-pack"),
    createdAt: "2026-03-16T10:00:00.000Z",
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
    imageUrl: img("cork-mat"),
    createdAt: "2026-03-19T10:00:00.000Z",
  },
  {
    id: "static-21",
    title: "Carbon Cycling Bottle",
    shortDescription: "Insulated 600 ml bottle for road and gravel.",
    fullDescription:
      "Double-wall vacuum insulation keeps drinks cold for 12 hours and fits standard cages with a no-leak twist cap.",
    price: 39,
    category: "sports",
    rating: 4.3,
    imageUrl: img("carbon-bottle"),
    createdAt: "2026-03-22T10:00:00.000Z",
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
    imageUrl: img("glow-serum"),
    createdAt: "2026-03-25T10:00:00.000Z",
  },
  {
    id: "static-22",
    title: "Cedar & Sage Candle",
    shortDescription: "60-hour soy candle in a refillable ceramic vessel.",
    fullDescription:
      "Hand-poured with a natural cotton wick. Notes of cedarwood, dry sage, and a whisper of black pepper.",
    price: 42,
    category: "beauty",
    rating: 4.7,
    imageUrl: img("cedar-candle"),
    createdAt: "2026-03-28T10:00:00.000Z",
  },
  {
    id: "static-23",
    title: "Silk Sleep Mask",
    shortDescription: "22 momme mulberry silk with adjustable strap.",
    fullDescription:
      "Helps reduce friction on skin and hair while blocking light. OEKO-TEX certified and machine-washable in a mesh bag.",
    price: 35,
    category: "beauty",
    rating: 4.4,
    imageUrl: img("silk-mask"),
    createdAt: "2026-03-31T10:00:00.000Z",
  },
  {
    id: "static-24",
    title: "Marble Stone Roller",
    shortDescription: "Cooling facial roller with dual heads.",
    fullDescription:
      "Carved from natural marble to soothe puffiness and improve absorption of serums. Includes a velvet travel pouch.",
    price: 29,
    category: "beauty",
    rating: 4.2,
    imageUrl: img("stone-roller"),
    createdAt: "2026-04-02T10:00:00.000Z",
  },
];
