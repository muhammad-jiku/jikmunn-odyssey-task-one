# Odyssey Next.js Assessment — Task Breakdown & Phased Plan

## Current Codebase Status

After Phase 0 implementation:

**Verified present & working:**
- ✅ Next.js 16 (App Router) + TypeScript scaffolded (`package.json`, `tsconfig.json`, `next.config.ts`)
- ✅ Tailwind CSS v4 wired (`@import "tailwindcss"` in `src/app/globals.css`, `postcss.config.mjs`)
- ✅ ESLint configured (`eslint.config.mjs`) — `npm run lint` passes clean
- ✅ TypeScript strict typecheck passes (`npx tsc --noEmit`)
- ✅ Production build passes (`npm run build` → static `/` route generated)
- ✅ Dependencies installed: `firebase`, `react-hook-form`, `zod`, `@hookform/resolvers`, `react-hot-toast`, `lucide-react`, `clsx`
- ✅ Folder structure: `src/app/`, `src/components/`, `src/context/`, `src/lib/`, `src/data/`, `src/types/`
- ✅ Firebase init module: [src/lib/firebase.ts](jikmunn-odyssey-task-one/src/lib/firebase.ts) (exports `firebaseApp`, `auth`, `googleProvider`)
- ✅ Item type: [src/types/item.ts](jikmunn-odyssey-task-one/src/types/item.ts)
- ✅ Static seed data (6 items, 6 categories): [src/data/items.ts](jikmunn-odyssey-task-one/src/data/items.ts)
- ✅ Design tokens (brand palette, surfaces, radius, shadows, focus-visible ring) in [src/app/globals.css](jikmunn-odyssey-task-one/src/app/globals.css)
- ✅ Root metadata branded ("Odyssey — Curated Marketplace") in [src/app/layout.tsx](jikmunn-odyssey-task-one/src/app/layout.tsx)
- ✅ `next.config.ts` allows `images.unsplash.com` remote images
- ✅ `.env.example` and `.env.local` (empty placeholders) present; `.env*` ignored by git

**Not yet implemented (deferred to later phases):**
- ⬜ UI primitives (Button/Input/Card/etc.), Navbar, Footer — Phase 1
- ⬜ All public pages beyond the default `/` placeholder — Phase 2
- ⬜ AuthContext, login/register pages — Phase 3
- ⬜ Protected routes (`/items/add`, `/items/manage`) — Phase 4
- ⬜ Polish pass — Phase 5
- ⬜ README rewrite + Vercel deploy — Phase 6

**Phase progress:**
- ✅ Phase 0 — Decide & Setup — **100% COMPLETE**
- ⬜ Phase 1 — Design System & Layout Shell — 0%
- ⬜ Phase 2 — Public Pages — 0%
- ⬜ Phase 3 — Firebase Authentication — 0%
- ⬜ Phase 4 — Protected Routes — 0%
- ⬜ Phase 5 — UI Polish & Responsiveness — 0%
- ⬜ Phase 6 — Quality, Deploy, Submit — 0%

**Remaining phases: 6** (Phases 1 → 6).

**Decisions locked in:** Theme = e-commerce / product catalog · Stack = Next.js (App Router) + TypeScript + Tailwind v4 + ESLint · Auth = Email/Password + Google.

**Note:** `.env.local` is created with empty Firebase keys — they must be filled before Phase 3 auth flows will work, but the app builds and runs without them.

---

## What the task asks (in short)

Build a **Next.js (App Router)** app with a chosen theme (e-commerce, events, courses, blog, etc.) that has:

- A polished, responsive **landing page** with 7 sections (Navbar, Hero, 4 themed sections, Footer)
- An **Items listing** page with search + 2 filters (≥6 items from static/local data)
- A **dynamic Item details** page (`/items/[id]`)
- An **About** page
- **Firebase Authentication** (email/password, optional Google)
- **Protected pages**: Add Item (`/items/add`) and Manage Items (`/items/manage`)
- Clean, consistent, mobile-first UI
- Deliverables: GitHub repo + Vercel live demo + README

---

## Recommended phased plan

### Phase 0 — Decide & Setup (foundation)
- Pick a theme (recommend **e-commerce / product catalog** — maps cleanly to "items", "add product", "manage products" wording in the brief).
- Scaffold Next.js (App Router) + TypeScript + Tailwind CSS.
- Install: `firebase`, `react-hook-form` + `zod` (forms/validation), `react-hot-toast` (toasts), `lucide-react` (icons), `clsx`.
- Set up folder structure: `app/`, `components/`, `lib/`, `context/`, `data/`, `types/`.
- Add `.env.local` for Firebase keys, `.gitignore`, base `globals.css`, design tokens (colors, spacing, font).

**Exit criteria:** App runs, Tailwind works, Firebase config loads without errors.

---

### Phase 1 — Design System & Layout Shell
- Define color palette, typography scale, spacing, radius, shadows in Tailwind config.
- Build reusable primitives: `Button`, `Input`, `Card`, `Badge`, `Container`, `Section`, `Spinner`.
- Build `Navbar` (sticky, responsive, mobile hamburger) + `Footer`.
- Wrap `app/layout.tsx` with Navbar/Footer + `AuthProvider` + `<Toaster />`.

**Exit criteria:** Every page inherits a consistent shell on mobile/tablet/desktop.

---

### Phase 2 — Public Pages (no auth needed yet)
1. **Landing `/`** — Hero, Features, Items preview, Testimonials, CTA banner, Footer.
2. **About `/about`** — title, description, image/section.
3. **Items `/items`** — search bar + 2 filters (e.g., category + price range or rating), responsive grid of ≥6 cards from static data in `data/items.ts`.
4. **Item Details `/items/[id]`** — image, title, full description, specs, price/category, related items, Back button.

**Exit criteria:** All public routes look polished and responsive without auth.

---

### Phase 3 — Firebase Authentication
- Create Firebase project, enable Email/Password (and Google).
- `lib/firebase.ts` (init), `context/AuthContext.tsx` (`user`, `loading`, `login`, `register`, `logout`, `googleLogin`).
- Build `/login` and `/register` pages with `react-hook-form` + zod validation, loading states, error toasts.
- Update Navbar: when logged in → user dropdown (avatar/name, **Add Product**, **Manage Products**, **Logout**) replacing login/register buttons.
- Redirect to `/` after successful login.

**Exit criteria:** Can register, login, logout; navbar reflects auth state; refresh persists session.

---

### Phase 4 — Protected Routes
- Create `components/ProtectedRoute.tsx` (or middleware) that redirects unauthenticated users to `/login`.
- **`/items/add`** — form (title, short desc, full desc, price, category, optional image URL); submit → save to localStorage (or Firestore if you want to extend); success toast.
- **`/items/manage`** — table/grid of items with **View** (link to details) and **Delete** (with confirm) actions; empty state UI.
- Use a small `lib/itemsStore.ts` to merge static items + user-added items from localStorage so they appear on `/items` too.

**Exit criteria:** Logged-out users get redirected; logged-in users can add/view/delete items end-to-end.

---

### Phase 5 — UI Polish & Responsiveness Pass
- Audit every page at 360px / 768px / 1280px.
- Add hover/focus states everywhere; ensure focus-visible rings (a11y).
- Add subtle micro-animations (fade-in, hover-lift) — optional `framer-motion`.
- Loading skeletons for items grid; empty/error states; 404 page.
- Verify color contrast and consistent typography hierarchy.

**Exit criteria:** No layout breaks; consistent spacing; everything feels intentional.

---

### Phase 6 — Quality, Deploy, Submit
- Lint/typecheck clean; remove `console.log`s.
- Write **README.md**: description, key features, setup steps (`.env.example`), Firebase setup notes, route summary table.
- Push to GitHub.
- Deploy to **Vercel**, add Firebase env vars in Vercel dashboard, add deployed domain to Firebase Auth authorized domains.
- Smoke-test the live URL (auth + protected routes).
- Submit GitHub link + live demo link.

**Exit criteria:** Live demo works, README complete, repo public.

---

## Suggested route summary

| Route | Type | Purpose |
|---|---|---|
| `/` | Public | Landing (7 sections) |
| `/about` | Public | About the app |
| `/items` | Public | Search + filter + grid |
| `/items/[id]` | Public | Item details |
| `/login`, `/register` | Public | Firebase auth |
| `/items/add` | Protected | Add new item |
| `/items/manage` | Protected | Manage user's items |
