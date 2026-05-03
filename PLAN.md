# Odyssey Project 1 Upgrade - Master Plan

## 0. Re-Verification Snapshot (May 03, 2026)

This plan has been re-analyzed against the current codebase implementation (not only file existence) by checking source behavior and running verification commands.

## Commands executed for verification

- frontend typecheck: pass
- frontend build: pass (34 static/SSG routes generated)
- frontend lint: pass via eslint CLI
- server lint: pass
- server build: pass
- server health DB verification: pass (`npm run verify:health-db`)
- server production boot verification: pass (`npm run verify:start-dist`)
- server auth + RBAC verification: pass (`npm run verify:auth-rbac`)
- server items API verification: pass (`npm run verify:items`)
- server phase 4 + 6 verification: pass (`npm run verify:phase4-6`)

## Implementation findings confirmed in code

- Frontend stack is fully implemented and running on Next.js + TypeScript + Tailwind.
- Backend Phase 1 stack is implemented in `server/` with Express + Mongoose + TypeScript.
- Backend modular folders exist and are wired: config, middleware, controllers, routes, services, utils, validators, scripts.
- Health endpoint exists at `/api/health` and reports DB connectivity.
- Centralized error handling and status helpers are implemented.
- Backend lint/format/build/dev/start scripts are implemented.
- JWT auth endpoints implemented: register, login, demo-login, refresh, logout, me.
- Refresh-token rotation and revocation are implemented with DB-backed token hashes.
- Password hashing is implemented with bcrypt.
- Role-based middleware is implemented and verified (`requireAuth`, `requireRole`).
- Demo user/admin seeding is implemented and verified.
- Frontend authentication is now backend JWT based with token refresh and persisted session hydration.
- Product data source for listing/details/manage/add is now backend `/api/items`.
- Contact flow persists to backend `/api/contact` and is queryable by admin.
- Profile APIs are implemented for read/update/password/avatar (`/api/users/me*`).
- Role-separated dashboard routes are implemented for user and admin surfaces.
- Required reusable primitives are implemented as dedicated components: Modal, Table, Dropdown.
- Admin overview, users, items, reports, and contact pages are wired to backend data.

## Compliance status by upgrade requirement area

- Global UI/design rules: partial
- Home/landing structure: partial (strong base, but section and dynamic-backend requirements still pending)
- Core listing/cards: complete
- Details page: partial (public + related implemented, multi-image gallery validation still pending)
- Listing/explore page: complete
- Authentication system (JWT + RBAC): complete
- Role-based dashboard: complete
- Additional pages with DB-backed contact: complete
- Backend architecture/security: partial (phase 1 complete; auth/rbac/security hardening pending)
- Performance optimization: partial
- Code quality/deployment/final submission: partial

## Phase 2 status verdict

- Phase 2 (codebase implementation): complete
- Phase 2 (verification against exit criteria): complete

Reason:

- Register/login implemented with bcrypt-hashed passwords.
- Access/refresh JWT flow implemented with refresh rotation and logout revocation.
- Role middleware implemented and enforced on protected routes.
- Demo admin/user accounts seeded and used by demo-login endpoint.
- Exit criteria validated through end-to-end auth+RBAC verification script and server checks.

## Phase 5 status verdict

- Phase 5 (codebase implementation): complete
- Phase 5 (verification against exit criteria): complete

Reason:

- Frontend auth context now uses backend JWT endpoints with refresh-token retry and logout cleanup.
- Frontend item store now reads/writes backend `/api/items` endpoints instead of localStorage/static merge.
- Add/manage/list/details flows consume backend item payloads.
- Frontend typecheck/build and frontend ESLint checks passed after migration.

## Phase 6 status verdict

- Phase 6 (codebase implementation): complete
- Phase 6 (verification against exit criteria): complete

Reason:

- Role-based dashboard shell and route guards are implemented for user/admin flows.
- User/admin sidebars and dashboard pages are implemented with distinct navigation.
- Admin overview and reporting charts consume real aggregate endpoints.
- Admin tables (users/items/contact) are data-backed with filters and actions.
- Frontend build/typecheck and backend `verify:phase4-6` both passed.

## Phase 4 status verdict

- Phase 4 (codebase implementation): complete
- Phase 4 (verification against exit criteria): complete

Reason:

- Contact submissions are persisted to DB via `/api/contact` and listable for admins.
- Profile update, password change, and avatar endpoints are implemented and validated.
- Frontend profile page and contact form are connected to backend APIs.
- Backend `verify:phase4-6` script passed end-to-end profile/contact scenarios.

## Phase 3 status verdict

- Phase 3 (codebase implementation): complete
- Phase 3 (verification against exit criteria): complete

Reason:

- Item schema, validators, service, controller, and routes are implemented and wired in API router.
- Query features (search, filtering, sorting, pagination) are implemented on `/api/items`.
- Owner/admin authorization checks are enforced for update/delete.
- Item verification suite passes CRUD/query/ownership/admin scenarios (`npm run verify:items`).

## Phase 1 status verdict

- Phase 1 (codebase implementation): complete
- Phase 1 (verification against exit criteria): complete

Reason:

- Server project and modular structure implemented in `server/`.
- MongoDB connection + env validation + health route implemented.
- Centralized error middleware + HTTP status helpers implemented.
- Lint/format/build/dev/start scripts implemented.
- Exit criteria validated via server lint/build and DB-connected health + production-boot checks.

## Phase 0 status verdict

- Phase 0 (codebase implementation): complete
- Phase 0 (full operational checklist): complete

Reason:

- Requirement lock and implementation criteria are now documented in this plan.
- Upgrade branch created: upgrade/project-1-upgrade
- Milestone labels created and versioned in repository: .github/labels.yml

## Remaining phase count

- If counting implementation phases only: 4 remaining (Phases 7, 8, 9, 10)
- If counting full operational completion including non-code setup: 4 remaining (Phases 7, 8, 9, 10)

## 1. Objective

Upgrade the existing marketplace into a full-stack, secure, role-based, production-ready product with complete frontend and backend delivery.

Primary success condition: every requirement from Odyssey Project - Project 1 Upgrade is implemented with working code, tested flows, and deployable infrastructure.

## 2. Current State and Gap Report

## Already strong in current codebase

- Next.js 16 + TypeScript + Tailwind UI foundation
- Responsive public pages and reusable UI components
- Product listing/search/filter/sort/pagination UI
- Product details and related items UI
- Login/register UX and protected routes (frontend guard)
- Cart flow and theme support
- Vercel deployment already live

## Missing or not compliant with new Upgrade brief

- Frontend is not yet wired to backend JWT auth flow (still Firebase client auth)
- Product data still static/localStorage instead of backend source of truth
- Contact form currently mailto instead of database persistence
- No Edit Item flow with server-side validation
- No profile update API with image upload and password change
- No role-based dashboard with sidebars, cards, charts, advanced tables
- No admin user management endpoints and UI
- No backend deployment and production API wiring
- No demo credential section finalized for submission

Conclusion: current app is a great frontend baseline, but full compliance now requires a backend-first rebuild of data and auth flows while preserving existing UI polish.

## 3. Target Architecture (Permanent and Scalable)

## Monorepo structure

- client/: existing Next.js app
- server/: Express API

## Server structure

- server/index.js
- server/src/config/
- server/src/middleware/
- server/src/models/
- server/src/controllers/
- server/src/routes/
- server/src/services/
- server/src/utils/
- server/src/validators/

## Tech decisions

- Backend: Express + Mongoose
- Auth: JWT access token + refresh token, role claims
- Password security: bcrypt
- Validation: zod or joi on request payloads
- File upload: Cloudinary (recommended) or S3 for profile/item images
- Charts data: aggregated backend endpoints consumed by dashboard
- Frontend data layer: API client modules + React Query or SWR

## 4. Data Models (Minimum)

- User
  - name, email (unique), passwordHash, role (user/admin), avatarUrl
  - createdAt, updatedAt, lastLoginAt
- Item
  - title, shortDescription, fullDescription, price, category, rating
  - images[] (min 2 for details gallery), ownerId, status, timestamps
- ContactMessage
  - name, email, subject, message, status, createdAt
- RefreshToken (if persisted)
  - userId, tokenHash, expiresAt, revokedAt

Optional but recommended:

- Review
- ActivityLog

## 5. API Surface (Minimum Required)

## Auth routes

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/demo-login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me

## User routes

- GET /api/users/me
- PATCH /api/users/me
- PATCH /api/users/me/password
- POST /api/users/me/avatar

## Item routes

- GET /api/items (search/filter/sort/pagination from query params)
- GET /api/items/:id
- POST /api/items (auth)
- PATCH /api/items/:id (owner/admin)
- DELETE /api/items/:id (owner/admin)

## Contact routes

- POST /api/contact
- GET /api/contact (admin)

## Admin routes

- GET /api/admin/overview
- GET /api/admin/users
- PATCH /api/admin/users/:id/role
- GET /api/admin/items
- DELETE /api/admin/items/:id
- GET /api/admin/reports/charts

## 6. Security and Validation Rules

- Hash passwords with bcrypt before save
- Never return passwordHash in API responses
- Access token short TTL (for example 15m), refresh token longer TTL (for example 7d)
- Implement token expiry handling on client (silent refresh then forced logout)
- Role middleware: requireRole(["admin"]) and requireAuth()
- Server-side validation for every mutating endpoint
- CORS locked to frontend origins only
- Rate limit auth routes
- Centralized error handler with safe production messages

## 7. UI and UX Compliance Checklist

Implement or verify all required reusable components:

- Button
- Input
- Card
- Badge
- Modal
- Table
- Dropdown

Forms that must exist and pass full standard (client + server validation, loading, success, error, labels, accessibility):

- Login
- Registration
- Contact (saved to DB)
- Create item
- Edit item
- Profile update

Landing page compliance:

- Sticky full-width navbar
- Minimum 4 logged-out links and 6 logged-in links
- Advanced dropdown (profile menu is acceptable)
- Hero at 60-70vh with clear hierarchy and interactive element
- At least 8 meaningful sections with real purpose/data
- Footer with working links, contact and social links

## 8. Implementation Phases (Execution Roadmap)

## Phase 0 - Requirement Lock and Branching

Tasks:

- [x] Freeze requirement checklist from upgrade brief
- [x] Create upgrade branch and milestone labels
- [x] Define done criteria per section (UI, auth, dashboard, backend)

Exit criteria:

- [x] Signed checklist committed in this PLAN
- [x] Branch and milestone labels prepared

Current completion:

- Codebase completion: 100%
- Full operational completion: 100% (3 of 3 core tasks done)

## Phase 1 - Backend Bootstrap (Express + Mongoose)

Tasks:

- [x] Create server project and modular structure
- [x] Add MongoDB url connection, env validation, health route
- [x] Add centralized error middleware, status code helpers
- [x] Add lint/format scripts and production startup scripts

Exit criteria:

- [x] Server boots locally and in production mode
- [x] Health endpoint returns OK with DB connectivity

Current completion:

- Codebase completion: 100%
- Verified completion: 100% (4 of 4 core tasks done, 2 of 2 exit criteria passed)

## Phase 2 - Auth and RBAC Foundation

Tasks:

- [x] Implement register/login with bcrypt + JWT access/refresh
- [x] Implement token refresh and logout revoke flow
- [x] Add role middleware (user/admin)
- [x] Seed one admin and one user demo account
- [x] Add demo-login endpoint

Exit criteria:

- [x] Login/register/demo-login works end-to-end
- [x] Role-protected endpoints reject unauthorized requests correctly

Current completion:

- Codebase completion: 100%
- Verified completion: 100% (5 of 5 core tasks done, 2 of 2 exit criteria passed)

## Phase 3 - Product API and Backend Query Features

Tasks:

- [x] Build Item schema and CRUD endpoints
- [x] Add backend search, filters, sorting, pagination
- [x] Add ownership checks for edit/delete
- [x] Add image array support (minimum 2 images per item)

Exit criteria:

- [x] /api/items fully powers listing and details pages
- [x] No hardcoded listing data used in production path

Current completion:

- Codebase completion: 100%
- Verified completion: 100% (4 of 4 core tasks done, 2 of 2 exit criteria passed)

## Phase 4 - Contact, Profile, and Uploads

Tasks:

- [x] Persist contact form to DB with validation
- [x] Build profile read/update/password-change APIs
- [x] Implement avatar upload pipeline (Cloudinary/S3)
- [x] Add frontend pages/forms for profile update

Exit criteria:

- [x] Contact submissions are stored and reviewable
- [x] Profile update and password update both pass validation and persist

Current completion:

- Codebase completion: 100%
- Verified completion: 100% (4 of 4 core tasks done, 2 of 2 exit criteria passed)

## Phase 5 - Frontend Data Migration to API

Tasks:

- [x] Replace localStorage item source with API client
- [x] Keep optimistic UX where needed but source of truth is backend
- [x] Wire auth state to JWT lifecycle and refresh handling
- [x] Preserve existing polished UI while switching data source

Exit criteria:

- [x] Explore/listing/details/create/edit/manage all backend-driven
- [x] No localhost URLs hardcoded in production build

Current completion:

- Codebase completion: 100%
- Verified completion: 100% (4 of 4 core tasks done, 2 of 2 exit criteria passed)

## Phase 6 - Role-Based Dashboards (User and Admin)

Tasks:

- [x] Build dashboard shell with role-specific sidebars
- [x] User sidebar with at least 4 menu items
- [x] Admin sidebar with at least 6 menu items
- [x] Overview cards using dynamic backend data
- [x] Add bar, line, and pie charts from real API aggregates
- [x] Build table screens with pagination/filtering/sorting/actions

Exit criteria:

- [x] User and admin dashboards are different, functional, and data-driven
- [x] Charts and tables are backed by real database data

Current completion:

- Codebase completion: 100%
- Verified completion: 100% (6 of 6 core tasks done, 2 of 2 exit criteria passed)

## Phase 7 - Landing and Section Expansion

Tasks:

- Expand landing to minimum 8 meaningful sections
- Ensure real business content only (no placeholders/lorem)
- Add dynamic statistics section powered by backend
- Verify navbar/footer links are fully functional

Exit criteria:

- Home page meets all section and content authenticity requirements

## Phase 8 - UI Consistency, Accessibility, Responsiveness

Tasks:

- Enforce 3 primary colors max plus neutral palette
- Verify contrast in dark mode
- Standardize spacing (4px or 8px scale)
- Standardize border radius and typography scale
- Test mobile/tablet/desktop for overflow/alignment issues

Exit criteria:

- Zero horizontal overflow and no layout breakpoints failing
- Reusable components visually consistent across pages

## Phase 9 - Performance and Quality Hardening

Tasks:

- Add image optimization and lazy loading where applicable
- Apply code splitting and route-level loading states
- Remove unnecessary re-renders (memoization/selectors)
- Remove development logs from production code
- Add smoke tests for critical flows

Exit criteria:

- Lighthouse/performance and runtime behavior are stable
- lint, typecheck, build pass for client and server

## Phase 10 - Deployment and Submission

Tasks:

- Deploy frontend to Vercel
- Deploy backend to Vercel and create vercel.json in the server dir
- Configure production environment variables
- Point frontend to production API base URL
- Validate end-to-end in production
- Finalize README with architecture, setup, APIs, demo credentials

Exit criteria:

- Frontend and backend live links both working
- Final submission bundle complete and verified

## 9. Definition of Done (100 Percent Compliance)

The upgrade is done only when all checks below are true:

- Every requirement in sections 1 to 13 is mapped to working code
- Product listing and details consume backend data only
- JWT + RBAC + bcrypt + token expiry handling are verified
- Contact form writes to DB and can be viewed by admin
- Edit item and profile update are implemented end-to-end
- User and admin dashboards are fully role-separated
- Charts and tables use dynamic backend data
- Frontend and backend are both deployed and production-ready
- README includes live URLs, repository, setup, and demo credentials

## 10. Permanent Maintenance Rules

- Any schema change must update model, validator, controller, API docs, and frontend types in same PR
- Any endpoint change must update API client, pages, and tests in same PR
- Keep shared constants for roles, status codes, and validation limits
- Add migration scripts for breaking data changes
- Protect main branch with required checks (lint, typecheck, build, tests)
- Use semantic commit messages and release tags

## 11. Suggested Work Order for Fastest Success

1. Phase 1 and 2 first (backend and auth foundation)
2. Phase 3 and 5 next (item API then frontend migration)
3. Phase 4 (contact/profile) and Phase 6 (dashboards)
4. Phase 7 and 8 polish and compliance pass
5. Phase 9 and 10 hardening, deploy, and submission

This order minimizes rework and ensures the app becomes truly permanent and scalable instead of patch-based.
