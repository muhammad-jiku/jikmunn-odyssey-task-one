# Jikmunn's Odyssey — Curated Marketplace

A polished, full-stack **Next.js 16 (App Router) + TypeScript + Tailwind v4 + Firebase** e-commerce / product-catalog reference app, built for the Odyssey Next.js Assessment Task.

It ships a public marketing site, a searchable product catalog with filters and pagination, dynamic product detail pages, Firebase email/password + Google authentication, an in-app cart, a working contact form, and protected screens to add and manage products — all responsive, accessible, and production-built.

> **Live demo:** <https://jikmunn-odyssey-task-one.vercel.app/>
> **Repository:** <https://github.com/muhammad-jiku/jikmunn-odyssey-task-one>

---

## ✨ Key features

- **App Router + TypeScript (strict)** — Next.js 16.2 with Turbopack, typed routes, and a clean `src/` layout.
- **Tailwind CSS v4** — single-file design tokens (`@theme inline`) with brand palette, surfaces, radii, shadows, focus-visible rings, micro-animations, and `prefers-reduced-motion` support.
- **In-app theme toggle** — light / dark / system preference persisted to `localStorage`, applied via `data-theme` with a synchronous `<head>` bootstrap script (no FOUC). Custom Tailwind `dark` variant keyed off `[data-theme="dark"]`.
- **Reusable UI primitives** — `Button`, `Input`, `PasswordInput` (with show/hide toggle), `Card`, `Badge`, `Container`, `Section`, `Spinner`, `Skeleton` (+ `ItemCardSkeleton`/`ItemsGridSkeleton`).
- **Layout shell** — sticky `Navbar` with mobile sheet, theme toggle, cart link with live item-count badge, user dropdown, active-link styling; 4-column `Footer`.
- **Polished landing page** — Hero, Features, Featured items, Testimonials, CTA banner.
- **Product catalog** — search by title/description, category filter, max-price range slider, sort options, active-filter chips, **8-per-page pagination** with prev/next + numbered buttons, empty-state CTA, responsive 1→2→3→4-col grid.
- **Dynamic product details** — SSG via `generateStaticParams` for static items + client fallback for user-added items (same URL, same layout), related-products section, Add-to-cart button, branded 404-style not-found state.
- **Shopping cart** — `CartContext` persisted to `localStorage`, full `/cart` page with image, quantity stepper, line removal, Order Summary aside, demo checkout, Clear all, and empty-state UI.
- **Firebase Authentication** — Email/Password + Google OAuth (`signInWithPopup`), `displayName` set via `updateProfile`, `onAuthStateChanged` session persistence, friendly error mapping (`auth/invalid-credential`, `auth/too-many-requests`, …), lazy SDK init that gracefully no-ops when env keys are empty (build-safe).
- **Protected routes** — `<ProtectedRoute>` guard with redirect to `/login?redirect=<path>`, full add-product form (`react-hook-form` + `zod`), manage-products screen (desktop table / mobile stacked cards) with confirm-delete.
- **Working contact form** — `react-hook-form` + `zod` validation (name, email, subject, message) that submits via `mailto:` to the project owner.
- **localStorage-backed user items** — `useSyncExternalStore` hooks with cached snapshots, cross-tab (`storage` event) and same-tab (custom event) sync; merged with the static seed for a unified Shop view.
- **A11y & polish** — global focus-visible ring (scoped away from text inputs to avoid double borders), `aria-invalid`/`aria-describedby` on inputs, skeleton loading states, `react-hot-toast` notifications, custom 404 page, brand `::selection`, smooth-scroll, reduced-motion override.
- **Quality gates green** — `npm run lint`, `npm run typecheck`, and `npm run build` all clean; **22 prerendered routes** (12 framework + 10 SSG product pages).

---

## 🧱 Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack, typed routes) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme inline` tokens, custom `dark` variant) |
| Forms | `react-hook-form` + `zod` (`@hookform/resolvers`) |
| Auth | Firebase Web SDK v12 (Email/Password + Google) |
| State | React Context + `useSyncExternalStore` over `localStorage` |
| Icons | `lucide-react` |
| Notifications | `react-hot-toast` |
| Utilities | `clsx` |

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── layout.tsx                  # Theme bootstrap > Providers > Navbar > <main> > Footer
│   ├── page.tsx                    # Landing
│   ├── globals.css                 # Tailwind + design tokens + dark variant + animations
│   ├── not-found.tsx               # Custom branded 404
│   ├── about/page.tsx
│   ├── contact/page.tsx            # Channels + ContactForm + FAQ
│   ├── cart/page.tsx               # Cart line items + Order Summary
│   ├── login/page.tsx              # Suspense-wrapped (useSearchParams) + PasswordInput
│   ├── register/page.tsx           # PasswordInput x2 (password + confirm)
│   └── items/
│       ├── page.tsx                # Shop (client AllItemsBrowser)
│       ├── loading.tsx             # Suspense skeleton for Shop
│       ├── [id]/page.tsx           # SSG static + client fallback
│       ├── add/page.tsx            # Protected
│       └── manage/page.tsx         # Protected
├── components/
│   ├── Providers.tsx               # ThemeProvider > AuthProvider > CartProvider + Toaster
│   ├── auth/ProtectedRoute.tsx
│   ├── contact/ContactForm.tsx
│   ├── items/{ItemCard,ItemsBrowser,AllItemsBrowser,UserItemDetailsClient,AddToCartButton}.tsx
│   ├── layout/{Navbar,Footer,nav-links}.tsx
│   └── ui/{Button,Input,PasswordInput,Card,Badge,Container,Section,Spinner,Skeleton,index}.tsx
├── context/{AuthContext,ThemeContext,CartContext}.tsx
├── data/items.ts                   # 10 hand-picked static seed products
├── lib/{firebase,itemsStore,items-utils}.ts
└── types/item.ts
```

---

## 🚀 Getting started

### Prerequisites

- **Node.js** ≥ 20 (tested on 22.17.1)
- **npm** ≥ 10

### 1. Install

```bash
git clone https://github.com/muhammad-jiku/jikmunn-odyssey-task-one.git
cd jikmunn-odyssey-task-one
npm install
```

### 2. Configure environment

Copy the template and fill it with your Firebase Web App config:

```bash
cp .env.example .env.local
```

```dotenv
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> The app builds and runs even with the keys empty — `firebaseEnabled` will be `false`, and auth screens will surface a friendly disabled-state banner.

### 3. Run

```bash
npm run dev          # http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run build        # production build (22 prerendered routes)
npm start            # serve the production build
```

---

## 🔥 Firebase setup

1. Create a project at <https://console.firebase.google.com>.
2. **Build → Authentication → Sign-in method**:
   - Enable **Email/Password**.
   - Enable **Google** (set a public-facing project name + support email).
3. **Project settings → General → Your apps → Web app** → register a web app and copy the config values into `.env.local` (see above).
4. **Authorized domains** (Authentication → Settings): add `localhost` (already there) and your deployed domain (e.g. `jikmunn-odyssey-task-one.vercel.app`).

User items are persisted to **`localStorage`** under the key `jikmunn-odyssey:user-items:v1` (no Firestore required for this assessment). They sync across tabs and within the current tab via a custom event. The cart and theme preference use `jikmunn-odyssey:cart:v1` and `jikmunn-odyssey:theme` respectively.

---

## 🧭 Route summary

| Route | Type | Auth | Purpose |
|---|---|---|---|
| `/` | Static | Public | Landing — Hero, Features, Featured items, Testimonials, CTA |
| `/about` | Static | Public | About — story + values + create-account CTA |
| `/contact` | Static | Public | Contact — channels + working `mailto:` form + FAQ |
| `/cart` | Static | Public | Cart line items, qty steppers, Order Summary, demo checkout |
| `/items` | Static | Public | Shop — search + category + price + sort + pagination |
| `/items/[id]` | SSG (10) + client fallback | Public | Product details + Add to cart + related products |
| `/login` | Static (Suspense) | Public | Email/Password + Google login (`?redirect=` aware) |
| `/register` | Static | Public | Create account (sets `displayName`) |
| `/items/add` | Static | **Protected** | Add a product (RHF + zod) |
| `/items/manage` | Static | **Protected** | Table / cards with View + Delete |
| `/_not-found` | Static | Public | Custom branded 404 |

---

## 🚢 Deploying to Vercel

The live deployment is hosted at <https://jikmunn-odyssey-task-one.vercel.app/>.

To deploy your own fork:

1. Push the repo to GitHub.
2. Import the project on <https://vercel.com/new>.
3. **Environment variables** — paste every `NEXT_PUBLIC_FIREBASE_*` key from `.env.local` into the Vercel project settings (Production + Preview).
4. Deploy. Vercel auto-detects Next.js and runs `next build`.
5. Add the resulting `*.vercel.app` domain to **Firebase Auth → Settings → Authorized domains**.
6. Smoke-test login, register, Google OAuth, add product, manage product, add-to-cart, and contact form on the live URL.

---

## 🧪 Quality gates

| Check | Command | Status |
|---|---|---|
| Lint | `npm run lint` | ✅ Clean (0 errors, 0 warnings) |
| Type-check | `npm run typecheck` | ✅ Clean |
| Production build | `npm run build` | ✅ 22 prerendered routes |

---

## 📜 License

Built for the Odyssey Next.js Assessment Task by [Muhammad Jiku](https://github.com/muhammad-jiku). All product imagery sourced from [Unsplash](https://unsplash.com).
