# BOOK — The Private Shelf

A clean-room Next.js implementation of **BOOK — The Private Shelf**: a premium editorial library plus a single-operator production engine for original books about attraction, dating, confidence, and relationships.

> **Attraction is a language. Learn how to read it.**

This repository does **not** depend on the deleted Velora codebase.

## Product shape

BOOK has two surfaces backed by the same PostgreSQL content truth:

- **Public library** — premium editorial home, spatial founding shelf, searchable catalogue, interactive book entrance, and quiet chapter reader.
- **Operator engine** — one-book-at-a-time production workflow that generates work packets, validates returned JSON, preserves partial work, and publishes only complete books.

Payments, membership entitlements, and real authentication are intentionally outside this pass; the architecture leaves room for them later.

## Public experience

The production UI follows an editorial-luxury direction rather than a feed or template marketplace:

- Vengeance Aurora + Gooey hero entrance.
- Vengeance Spotlight Navbar / Glass Dock navigation.
- Vengeance 3D Books Showcase for the founding shelf.
- Original art-directed cover system for all three founding volumes.
- Search Modal catalogue discovery.
- Interactive Book on volume detail.
- Truthful product-system counters and FAQ — no fabricated ratings, testimonials, urgency, readership, or commerce controls.
- Paper-like chapter reader with heavy motion deliberately removed.
- Reduced-motion support.

### Typography and palette

The production type system is self-hosted and version-pinned through Fontsource:

- Instrument Serif — brand/display typography.
- Geist — navigation, controls and supporting UI copy.
- Geist Mono — indices and structured production data.
- Newsreader — long-form chapter reading.

The core palette is Obsidian `#090807`, Ivory `#F3EDE3`, Burnished Copper `#C98762`, Oxblood `#682F2D`, Tobacco `#80634E`, and Warm Grey `#AAA097`.

See `docs/UI_PRODUCTION_2026.md` and `docs/VENGEANCE-MAPPING.md`.

## Production engine

- State machine: `queued → in_progress → complete → published`.
- Database + server enforcement of one active book at a time.
- Book N+1 remains locked until every earlier book is explicitly `published`.
- Smallest-incomplete-unit targeting.
- Unit state: `not_started | partial | complete`.
- Partial-unit persistence with exact gap carry-forward.
- Repair packets preserve valid content and target unresolved gaps.
- Server-recomputed word counts; AI word-count claims are never trusted.
- Strict JSON shape / required-field validation.
- Duplicate-safe writes to the canonical `book_id + unit_key` production slot.
- Manual publish gate after every required unit passes.
- Public reader content maps directly from validated DB rows.

## Vengeance UI source policy

Vengeance UI is the animation/component interaction source for the production build.

- Repository: `Ashutoshx7/VengeanceUI`
- Pinned commit: `813d9c192b1f82cb36db3d5af93c2ac7d3285ae4`
- Registry: `https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/813d9c192b1f82cb36db3d5af93c2ac7d3285ae4/public/r/{name}.json`

The lock is stored in `.vengeance-lock.json` and `components.json`. Production component source is vendored in `src/components/ui/`, so normal development and production builds are self-contained. `npm run vengeance:sync` is the explicit, pinned update/verification path; it is not part of `npm run dev` or `npm run build`.

## Local setup

Requires **Node.js 20.12+** and PostgreSQL. Docker Compose is included for local Postgres.

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:setup
npm run dev
```

`db:setup` is safe for an existing local Postgres volume: it ensures the configured database exists, applies migrations, then seeds the founding production contracts.

Open:

- Public library: `http://localhost:3000`
- Operator engine: `http://localhost:3000/admin`

If PostgreSQL is hosted elsewhere, set `DATABASE_URL` in `.env` instead of using Docker Compose.

## Operator loop

1. Start the only unlocked queued volume.
2. Click **Copy Work Packet**.
3. Paste the packet into ChatGPT.
4. Paste the returned JSON into the operator input.
5. Click **Paste & Validate**.
6. Incomplete but parseable work is saved as `partial`; the next packet contains the existing content plus exact gaps.
7. A zero-issue unit becomes `complete` and the next smallest missing unit becomes active.
8. When every unit is complete, the volume becomes `complete`.
9. Explicitly publish it to expose reader content and unlock the next volume.

There is no per-book frontend implementation step.

## Quality gate

`.github/workflows/quality.yml` runs a clean production verification with PostgreSQL:

```text
install dependencies
→ verify/update pinned Vengeance source on the feature branch
→ ensure/migrate/seed PostgreSQL
→ contract checks
→ TypeScript
→ ESLint
→ Next.js production build
→ live route smoke + desktop/mobile visual captures
```

Useful local commands:

```bash
npm run vengeance:sync   # explicit pinned UI update/verification
npm run db:setup
npm run contract-check
npm run typecheck
npm run lint
npm run build
```

## Repository guide

- `src/app/` — public pages, reader, operator pages, API routes.
- `src/components/site/` — BOOK public composition around Vengeance UI.
- `src/components/admin/` — production console.
- `src/components/ui/` — vendored production Vengeance source.
- `src/lib/repository.ts` — production state transitions and content access.
- `src/lib/work-packet.ts` — smallest-gap work packet generation.
- `src/lib/content-schema.ts` — strict server validation.
- `db/migrations/` — database schema.
- `scripts/ensure-database.mjs` — local target-database bootstrap.
- `scripts/seed.mjs` — founding books and required unit contracts.
- `docs/ARCHITECTURE.md` — system invariants.
- `docs/UI_PRODUCTION_2026.md` — production experience direction.
- `docs/VENGEANCE-MAPPING.md` — exact Vengeance production mapping.
