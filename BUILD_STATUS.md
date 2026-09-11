# Build status

## Completed

- Fresh Next.js/App Router project structure.
- PostgreSQL schema + founding-book seed.
- Public hero, library shelf, search, detail entrance, reader.
- Admin production engine and API routes.
- One-active-book and prior-published locks.
- Smallest-unit work packets.
- Partial repair-gap continuation.
- Strict structural validation + server word recount.
- Manual publishing boundary and public-content guard.
- Exact Vengeance UI registry pin and sync script.
- Original founding cover SVGs.
- Architecture and source-mapping docs.

## Offline verification performed in this environment

- `node scripts/contract-check.mjs` — PASS.
- Node syntax checks for migration/seed/sync scripts — PASS.
- TypeScript `transpileModule` syntax pass over the full `src/` tree — PASS.
- Reader motion-import guard — PASS as part of contract check.
- No local `node_modules` or generated build output is included.

## Verification that requires network/dependencies

This execution environment could not complete npm dependency installation or raw registry downloads. Therefore these commands must run in a normal connected development environment before production deployment:

```bash
npm install
npm run vengeance:sync
npm run db:setup
npm run verify
npm run build
```

The Vengeance registry is pinned to the exact upstream commit in `.vengeance-lock.json`, so sync is deterministic with respect to source content.
