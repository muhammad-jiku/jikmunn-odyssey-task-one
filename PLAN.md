# Odyssey Next.js Assessment — Task Breakdown & Phased Plan

## Current Codebase Status

After Phase 5 implementation:

**Phase 0 verified (still passing):**
- ✅ Next.js 16 (App Router) + TypeScript scaffolded
- ✅ Tailwind CSS v4 + design tokens (brand palette, surfaces, radius, shadows, focus-visible ring) in [src/app/globals.css](jikmunn-odyssey-task-one/src/app/globals.css)
- ✅ Folder structure: `src/app/`, `src/components/`, `src/components/ui/`, `src/components/layout/`, `src/context/`, `src/lib/`, `src/data/`, `src/types/`
- ✅ Static seed data, `Item` type, Firebase wiring, `.env.example`/`.env.local`

**Phase 1 verified present & working:**
- ✅ Reusable UI primitives in [src/components/ui/](jikmunn-odyssey-task-one/src/components/ui):
  - [Button.tsx](jikmunn-odyssey-task-one/src/components/ui/Button.tsx) — 5 variants (primary/secondary/ghost/danger/outline), 3 sizes, loading state, leftIcon/rightIcon, fullWidth, forwardRef
  - [Input.tsx](jikmunn-odyssey-task-one/src/components/ui/Input.tsx) — label, hint, error, leftIcon, rightAddon, a11y `aria-invalid`/`aria-describedby`
  - [Card.tsx](jikmunn-odyssey-task-one/src/components/ui/Card.tsx) — `Card`, `CardBody`, `CardHeader`, `CardFooter` with hover-elevation
  - [Badge.tsx](jikmunn-odyssey-task-one/src/components/ui/Badge.tsx) — 5 tones (neutral/brand/success/warning/danger)
  - [Container.tsx](jikmunn-odyssey-task-one/src/components/ui/Container.tsx) — max-w-7xl responsive container
  - [Section.tsx](jikmunn-odyssey-task-one/src/components/ui/Section.tsx) — eyebrow/title/description, 3 background tones, optional `bleed`
  - [Spinner.tsx](jikmunn-odyssey-task-one/src/components/ui/Spinner.tsx) — 3 sizes, accessible `role="status"`
  - [index.ts](jikmunn-odyssey-task-one/src/components/ui/index.ts) — barrel export
- ✅ Layout components in [src/components/layout/](jikmunn-odyssey-task-one/src/components/layout):
  - [Navbar.tsx](jikmunn-odyssey-task-one/src/components/layout/Navbar.tsx) — sticky, backdrop-blur, logo, **4 routes** (Home, Shop, About, Contact), active-link styling, login/register buttons (logged-out), full user dropdown with Add Product / Manage Products / Logout (logged-in), mobile hamburger sheet, click-outside dismiss, route-change auto-close
  - [Footer.tsx](jikmunn-odyssey-task-one/src/components/layout/Footer.tsx) — 4-column responsive grid, brand block, Explore/Account link columns, social icons (inline GitHub/Twitter/Instagram SVGs), © year, build credit
  - [nav-links.ts](jikmunn-odyssey-task-one/src/components/layout/nav-links.ts) — shared nav config
- ✅ [AuthContext](jikmunn-odyssey-task-one/src/context/AuthContext.tsx) — full implementation: `user`, `loading`, `firebaseEnabled`, `login`, `register`, `loginWithGoogle`, `logout`; uses `onAuthStateChanged` and gracefully no-ops when Firebase env keys are missing (build-safe)
- ✅ [Providers.tsx](jikmunn-odyssey-task-one/src/components/Providers.tsx) — wraps `AuthProvider` + `react-hot-toast` `<Toaster />` with themed styling
- ✅ [Firebase lazy init](jikmunn-odyssey-task-one/src/lib/firebase.ts) refactored to `getFirebaseApp()` / `getFirebaseAuth()` singletons + `firebaseEnabled` flag — no longer crashes prerender when env is empty
- ✅ [layout.tsx](jikmunn-odyssey-task-one/src/app/layout.tsx) — wraps `<Providers>` → `<Navbar />` → `<main>{children}</main>` → `<Footer />` so every page (including 404) inherits the shell
- ✅ `npm run lint` — clean (0 errors, 0 warnings)
- ✅ `npx tsc --noEmit` — clean
- ✅ `npm run build` — production build passes; `/` and `/_not-found` prerender successfully

**Phase 2 verified present & working:**
- ✅ Items helpers in [src/lib/items-utils.ts](jikmunn-odyssey-task-one/src/lib/items-utils.ts) — `CATEGORY_LABELS`, `ALL_CATEGORIES`, `formatPrice` (Intl USD), `formatDate` (Intl en-US short)
- ✅ [ItemCard.tsx](jikmunn-odyssey-task-one/src/components/items/ItemCard.tsx) — article card with `next/image` (4:3 aspect, inline SVG placeholder fallback), category Badge, amber rating star, line-clamped description, formatted price, hover-lift + image-zoom, `View Details` button → `/items/${id}`
- ✅ [ItemsBrowser.tsx](jikmunn-odyssey-task-one/src/components/items/ItemsBrowser.tsx) — client component with **search by name/desc**, **category filter** (All + 6 categories), **max-price range slider**, sort (featured / price asc/desc / top-rated), active-filter chips, result count, `Clear` button, empty state with `Reset filters` CTA, responsive grid (1 → 2 → 3 → 4 cols)
- ✅ [src/app/page.tsx](jikmunn-odyssey-task-one/src/app/page.tsx) — Full **landing page** (7 sections incl. layout): Navbar (layout) + Hero (gradient eyebrow, headline, dual CTAs, image with floating rating card, stats row) + Features (4-card grid) + Featured Items preview (4 ItemCards, "View all" link) + Testimonials (3 quote cards) + CTA banner (brand-gradient, dual buttons) + Footer (layout)
- ✅ [src/app/items/page.tsx](jikmunn-odyssey-task-one/src/app/items/page.tsx) — `/items` server page with metadata + header + `<ItemsBrowser items={staticItems} />`
- ✅ [src/app/items/\[id\]/page.tsx](jikmunn-odyssey-task-one/src/app/items/[id]/page.tsx) — `/items/[id]` dynamic route with `generateStaticParams` + `generateMetadata`, async `params`, `notFound()` on miss, 2-col layout (image / info), category Badge + rating + price + full description + 3-stat info grid (category/rating/added-date), Add-to-cart + Continue-shopping buttons, Back link, **Related products** section (same category, up to 4)
- ✅ [src/app/about/page.tsx](jikmunn-odyssey-task-one/src/app/about/page.tsx) — About page: hero (story + image + dual CTA) + 4-card values section + create-account CTA card
- ✅ [src/app/contact/page.tsx](jikmunn-odyssey-task-one/src/app/contact/page.tsx) — Contact page: centered hero + 4 contact channels (email/phone/chat/visit) + FAQ list
- ✅ All 6 static items prerender as SSG: `/items/static-1` … `/items/static-6`

**Phase 3 verified present & working:**
- ✅ [src/app/login/page.tsx](jikmunn-odyssey-task-one/src/app/login/page.tsx) — `/login` page: `Suspense`-wrapped client component (so `useSearchParams` doesn't break SSG), `react-hook-form` + `zod` validation (email + min-6 password), email/password inputs with `Mail`/`Lock` left icons + inline error messages, submit button with `isLoading` state, divider, **Continue with Google** button (inline brand SVG), `?redirect=` support, link to `/register`, friendly amber banner when `firebaseEnabled === false`, `react-hot-toast` success/error toasts, `router.push(redirect)` + `router.refresh()` on success
- ✅ [src/app/register/page.tsx](jikmunn-odyssey-task-one/src/app/register/page.tsx) — `/register` page: `react-hook-form` + `zod` schema with `name` (2–60 chars), `email`, `password` (min 6), `confirmPassword` + `.refine()` cross-field match check, 4 inputs with icons + per-field error messages, submit calls `register(email, password, name)` (sets `displayName` via `updateProfile`), Google OAuth button, friendly Firebase-disabled banner, link to `/login`, redirects to `/` on success
- ✅ Both pages share consistent card layout (max-w-md, surface bg, brand-accented icon header, divider before Google CTA) and disable both buttons while either submission is in flight
- ✅ [src/context/AuthContext.tsx](jikmunn-odyssey-task-one/src/context/AuthContext.tsx) wired end-to-end via `useAuth()`: `login`, `register` (with displayName via `updateProfile`), `loginWithGoogle` (`signInWithPopup` + `GoogleAuthProvider`), `logout`, `firebaseEnabled` flag — Firebase env-empty path is graceful (forms throw a friendly error captured by toast)
- ✅ [Navbar](jikmunn-odyssey-task-one/src/components/layout/Navbar.tsx) already reflects auth state: shows `Login`/`Register` buttons when logged-out, user dropdown (avatar initials, name, email, **Add Product**, **Manage Products**, **Logout**) when logged-in — verified working with the new pages
- ✅ `npm run lint` — clean (0 errors, 0 warnings)
- ✅ `npx tsc --noEmit` — clean
- ✅ `npm run build` — production build passes; **15 routes prerendered** (`/`, `/about`, `/contact`, `/items`, `/items/[id]` × 6, `/login`, `/register`, `/_not-found`)

**Phase 4 verified present & working:**
- ✅ [src/lib/itemsStore.ts](jikmunn-odyssey-task-one/src/lib/itemsStore.ts) — localStorage-backed user-items store: `getUserItems`, `getAllItems` (merge `[...userItems, ...staticItems]`), `findItemById`, `addUserItem` (auto-generates id via `crypto.randomUUID()`, stamps `createdAt`, attaches `ownerId`), `deleteUserItem`, `isUserItem`; `useUserItems` and `useAllItems` React hooks built on `useSyncExternalStore` with cross-tab sync via `storage` event + same-tab sync via custom `odyssey:user-items:change` event; SSR-safe (server snapshot returns `[]`)
- ✅ [src/components/auth/ProtectedRoute.tsx](jikmunn-odyssey-task-one/src/components/auth/ProtectedRoute.tsx) — client guard: shows centered `Spinner` + status message while `loading`, redirects unauthenticated users to `/login?redirect=<currentPath>` via `router.replace`, gracefully reports when Firebase isn't configured
- ✅ [src/components/items/AllItemsBrowser.tsx](jikmunn-odyssey-task-one/src/components/items/AllItemsBrowser.tsx) — thin client wrapper that calls `useAllItems()` and renders `<ItemsBrowser items={...} />` so the Shop page sees user-added items live
- ✅ [src/components/items/UserItemDetailsClient.tsx](jikmunn-odyssey-task-one/src/components/items/UserItemDetailsClient.tsx) — client fallback for `/items/[id]`: looks up via `useAllItems()`, renders the same details layout as the static SSG page (image / title / rating / price / full description / 3-stat info grid / Add-to-cart + Continue-shopping / Related products) when found, or a friendly “Product not found” card with `Back to all products` CTA when missing
- ✅ [src/app/items/page.tsx](jikmunn-odyssey-task-one/src/app/items/page.tsx) — updated to render `<AllItemsBrowser />` (was `<ItemsBrowser items={staticItems} />`), so user-added products appear on Shop alongside the curated catalog
- ✅ [src/app/items/\[id\]/page.tsx](jikmunn-odyssey-task-one/src/app/items/[id]/page.tsx) — server route now delegates to `<UserItemDetailsClient id={id} />` when `staticItems.find(...)` misses (instead of `notFound()`), preserving SSG for known static items while still serving user items at the same URL
- ✅ [src/app/items/add/page.tsx](jikmunn-odyssey-task-one/src/app/items/add/page.tsx) — protected `/items/add`: `react-hook-form` + `zod` schema (`title` 3–80, `shortDescription` 10–160, `fullDescription` 20–2000, `price` 0–100000 via `valueAsNumber`, `category` enum of all 6 categories, `rating` 0–5, optional `imageUrl` validated as `https?://`), 7 fields incl. `<textarea>` for full description and `<select>` for category, brand-accented header with `PackagePlus` icon, Save + Cancel buttons, success toast + redirect to `/items/manage`
- ✅ [src/app/items/manage/page.tsx](jikmunn-odyssey-task-one/src/app/items/manage/page.tsx) — protected `/items/manage`: live list via `useUserItems()`; **desktop table** (Product image+title+desc, Category badge, Price, Added date, View + Delete actions); **mobile stacked cards** with same data; per-row `Delete` triggers `window.confirm()` then `deleteUserItem`, success toast; rich empty state (icon, copy, primary CTA to `/items/add`); page header with count + `Add product` button
- ✅ Both protected routes wrapped in `<ProtectedRoute>` — unauthenticated visitors get redirected to `/login?redirect=...`
- ✅ Existing Navbar dropdown (`Add Product`, `Manage Products`) already linked to these routes — verified end-to-end
- ✅ `npm run lint` — clean (0 errors, 0 warnings)
- ✅ `npx tsc --noEmit` — clean
- ✅ `npm run build` — production build passes; **17 routes prerendered** (`/`, `/about`, `/contact`, `/items`, `/items/[id]` × 6, `/items/add`, `/items/manage`, `/login`, `/register`, `/_not-found`)

**Phase 5 verified present & working:**
- ✅ [src/app/globals.css](jikmunn-odyssey-task-one/src/app/globals.css) — added micro-animation system: `@keyframes odyssey-fade-in`, `odyssey-fade-in-up`, `odyssey-shimmer`; utility classes `.animate-fade-in`, `.animate-fade-in-up` with cubic-easing; staggered delay utilities (`.animation-delay-100/200/300`); brand-tinted `::selection` (light + dark); `html { scroll-behavior: smooth }`; **`@media (prefers-reduced-motion: reduce)`** override that neutralizes animations + transitions for accessibility
- ✅ [src/components/ui/Skeleton.tsx](jikmunn-odyssey-task-one/src/components/ui/Skeleton.tsx) — `Skeleton` primitive (a11y `role="status"` + `aria-label`/`aria-live`) using shimmer keyframe; composed `ItemCardSkeleton` (mirrors ItemCard layout: 4:3 image block, badge, title, two text rows, price + button row) and `ItemsGridSkeleton` (responsive 1→2→3→4 col grid, default 8 cards) — all dark-mode aware
- ✅ [src/components/ui/index.ts](jikmunn-odyssey-task-one/src/components/ui/index.ts) — barrel export now exposes `Skeleton`, `ItemCardSkeleton`, `ItemsGridSkeleton`, `SkeletonProps`
- ✅ [src/app/not-found.tsx](jikmunn-odyssey-task-one/src/app/not-found.tsx) — custom **404 page** styled to match shell: `Section bg="surface"` + centered card with brand-tinted `Compass` icon, “Error 404” eyebrow, headline, subcopy, dual CTAs (`Back to home` primary + `Browse products` outline), `animate-fade-in-up` entrance, dedicated `<title>` metadata
- ✅ [src/app/items/loading.tsx](jikmunn-odyssey-task-one/src/app/items/loading.tsx) — Next.js route-level **loading skeleton** for `/items` matching the real layout: header copy skeletons + filter-bar skeleton row (search/category/sort + range row) + `ItemsGridSkeleton count={8}` (Suspense fallback when navigating into Shop)
- ✅ [src/app/page.tsx](jikmunn-odyssey-task-one/src/app/page.tsx) — applied `animate-fade-in-up` to hero copy column and `animate-fade-in-up animation-delay-100` to the hero image column for a subtle staggered entrance (no extra deps; honors `prefers-reduced-motion`)
- ✅ Existing focus-visible ring (`outline: 2px solid var(--brand-500)`) verified globally and on all interactive elements (Buttons, Inputs, Card links via `focus-within:` already present on `ItemCard`, Navbar links, dropdown items, mobile hamburger)
- ✅ Hover-lift / hover-zoom polish already in `ItemCard` (`hover:-translate-y-0.5`, image `group-hover:scale-105`) and feature/testimonial cards on landing — verified consistent
- ✅ Empty / error states already polished in earlier phases (ItemsBrowser “Reset filters”, manage-page empty state, UserItemDetailsClient “Product not found”) — re-verified intact
- ✅ Responsive audit at 360 / 768 / 1280 — no layout breaks (grid scales 1→2→3→4 cols; Navbar sheet on mobile; manage-page table → stacked cards; hero stacks at `lg:` breakpoint)
- ✅ `npm run lint` — clean (0 errors, 0 warnings)
- ✅ `npx tsc --noEmit` — clean
- ✅ `npm run build` — production build passes; **17 routes prerendered** (`/`, `/_not-found`, `/about`, `/contact`, `/items`, `/items/[id]` × 6, `/items/add`, `/items/manage`, `/login`, `/register`)

**Not yet implemented (deferred to later phases):**
- ⬜ README rewrite + Vercel deploy — Phase 6

**Phase progress:**
- ✅ Phase 0 — Decide & Setup — **100% COMPLETE**
- ✅ Phase 1 — Design System & Layout Shell — **100% COMPLETE**
- ✅ Phase 2 — Public Pages — **100% COMPLETE**
- ✅ Phase 3 — Firebase Authentication — **100% COMPLETE**
- ✅ Phase 4 — Protected Routes — **100% COMPLETE**
- ✅ Phase 5 — UI Polish & Responsiveness — **100% COMPLETE**
- ⬜ Phase 6 — Quality, Deploy, Submit — 0%

**Remaining phases: 1** (Phase 6).

**Decisions locked in:** Theme = e-commerce / product catalog · Stack = Next.js (App Router) + TypeScript + Tailwind v4 + ESLint · Auth = Email/Password + Google.

**Note:** `.env.local` still has empty Firebase keys — the app builds and runs without them; auth flows will surface a friendly error until keys are filled in Phase 3.

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
