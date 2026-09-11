# BOOK — The Private Shelf

A fresh, clean-room Next.js implementation of **BOOK — The Private Shelf**: a premium public library plus a single-operator production engine for original books about attraction, dating, confidence, and relationships.

> Positioning: **Attraction is a language. Learn how to read it.**

This repository does **not** depend on the deleted Velora codebase.

## What is implemented

- Public home page with Vengeance UI Aurora/Gooey entrance and the 3D Books Showcase shelf.
- Searchable library/catalogue.
- Book detail experience using Vengeance UI Interactive Book as the entrance.
- Clean paper-like chapter reader with heavy motion deliberately removed.
- PostgreSQL content model for books, production units, validation state, and audit events.
- Production state machine: `queued → in_progress → complete → published`.
- Database + server enforcement of one active book at a time.
- Book N+1 lock until every earlier book is explicitly `published`.
- Automatic smallest-incomplete-unit targeting.
- Partial-unit persistence and exact gap carry-forward.
- Server-recomputed word count and strict structural validation.
- Duplicate-safe unit writes through one canonical seeded unit per `book_id + unit_key`.
- Admin unit workflow with exactly two unit-level actions: **Copy Work Packet** and **Paste & Validate**.
- Manual publish gate after all required units validate.
- Live public reader content rendered directly from the validated content store.

Payments, checkout, membership entitlements, and real authentication are intentionally not implemented in this pass.

## Vengeance UI source policy

Vengeance UI is the only animation/component design source for this build. The project pins the upstream source to:

- Repository: `Ashutoshx7/VengeanceUI`
- Commit: `813d9c192b1f82cb36db3d5af93c2ac7d3285ae4`
- Registry: `https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/813d9c192b1f82cb36db3d5af93c2ac7d3285ae4/public/r/{name}.json`

The exact lock is stored in `.vengeance-lock.json` and `components.json`.

`npm run vengeance:sync` copies the upstream registry components into `src/components/ui/`. The only post-sync modification is visible copy inside Vengeance's Generate Button (`Generate` → `Copy Work Packet`, `Generating` → `Copying Packet`). Its animation logic is not rebuilt or replaced.

## Local setup

Requires Node.js 22+ and PostgreSQL 16+ (the supplied Docker Compose file is the easiest path if Docker is available).

```bash
cp .env.example .env
npm install
npm run vengeance:sync
docker compose up -d
npm run db:setup
npm run dev
```

Then open:

- Public library: `http://localhost:3000`
- Operator engine: `http://localhost:3000/admin`

If PostgreSQL is hosted elsewhere, set `DATABASE_URL` in `.env` instead of using Docker Compose.

## Operator loop

1. Start the only unlocked queued book.
2. Click **Copy Work Packet**.
3. Paste the packet into ChatGPT.
4. Paste ChatGPT's JSON response into the admin input.
5. Click **Paste & Validate**.
6. If incomplete, the JSON is saved as `partial` and the exact gaps are attached to the next packet for the same unit.
7. If complete, that unit closes and the next smallest missing unit becomes the target.
8. When every unit is complete, the book moves to `complete`.
9. Explicitly publish it to make reader content public and unlock the next book.

There is no per-book frontend implementation step.

## Validation rules

The server never trusts AI completion claims. It:

- parses the pasted JSON;
- checks required fields;
- validates the exact unit schema;
- verifies the chapter number against the target unit;
- recomputes word count from content server-side;
- applies the minimum word threshold;
- saves valid-object failures as `partial` with exact issues;
- marks a unit `complete` only with zero validation issues.

The submitted `word_count` is always overwritten with the server count.

## Useful commands

```bash
npm run vengeance:sync   # pull exact pinned Vengeance UI source
npm run db:migrate       # apply schema
npm run db:seed          # seed founding books + production units
npm run db:setup         # migrate + seed
npm run contract-check   # offline architectural/non-negotiable checks
npm run typecheck
npm run lint
npm run build
```

## Repository guide

- `src/app/` — public pages, reader, admin, API routes.
- `src/components/site/` — BOOK composition around Vengeance UI components.
- `src/components/admin/` — production console.
- `src/components/ui/` — populated by the pinned Vengeance registry sync.
- `src/lib/repository.ts` — production state transitions and content access.
- `src/lib/work-packet.ts` — smallest-gap packet generation.
- `src/lib/content-schema.ts` — structural/server validation.
- `db/migrations/` — immutable database schema.
- `scripts/seed.mjs` — founding books and required unit contracts.
- `docs/ARCHITECTURE.md` — system design and invariants.
- `docs/VENGEANCE-MAPPING.md` — exact component-to-surface mapping.

## Verification note

`npm run contract-check` runs without third-party packages and verifies the core build invariants. A full dependency install/typecheck/build requires registry/npm network access because Vengeance UI components are intentionally sourced from the pinned upstream registry rather than recreated locally.
