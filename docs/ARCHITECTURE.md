# BOOK — Architecture

## 1. System shape

BOOK has one content system and two surfaces:

```text
                           ┌─────────────────────────┐
                           │ PostgreSQL content truth│
                           │ books + book_units      │
                           └────────────┬────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
          ┌─────────▼──────────┐                  ┌─────────▼──────────┐
          │ Public library     │                  │ Admin production   │
          │ shelf/detail/read  │                  │ work packet/validate│
          └────────────────────┘                  └─────────────────────┘
```

Validated content is not copied into page-specific files. Public pages resolve the same database rows the production engine writes.

## 2. Book state machine

```text
queued ──start──> in_progress ──all units complete──> complete ──manual publish──> published
```

### Invariants

- PostgreSQL partial unique index permits only one `in_progress` book.
- `startBookProduction()` also takes a transaction advisory lock and rejects any other active book.
- A queued book rejects start if any earlier `sort_order` book is not `published`.
- `published` is never inferred from content completion; it requires an explicit admin action.

This means Book N+1 is blocked by both UI state and server/database rules.

## 3. Unit model

A book is composed of ordered `book_units`:

```text
front matter → chapter 1 → … → chapter 8 → back matter
```

Every unit has:

- `unit_key`
- stable `sequence`
- `required_fields`
- `output_schema`
- `min_word_count`
- `status`: `not_started | partial | complete`
- current JSON `content`
- server `computed_word_count`
- exact `validation_errors`

`UNIQUE(book_id, unit_key)` and `UNIQUE(book_id, sequence)` prevent duplicate production slots.

## 4. Smallest-gap algorithm

The next work target is always:

```sql
SELECT *
FROM book_units
WHERE book_id = $active_book
  AND status <> 'complete'
ORDER BY sequence
LIMIT 1;
```

If the target is `partial`, the packet contains both `existing_partial_content` and `validation_gaps`. The operator therefore resumes exactly where production stopped instead of manually tracking chapter state.

## 5. Work packet contract

`GET /api/admin/work-packet` builds the packet from live state. It includes:

- book identity, positioning, voice, target reader;
- short continuity summary from prior complete units;
- exactly one target unit;
- required fields and minimum word count;
- exact output schema;
- partial content and unresolved gaps when present;
- instruction to return JSON only.

The operator copies this packet into ChatGPT manually. No model API key is needed by the application in this pass.

## 6. Validation

`POST /api/admin/validate` accepts one string containing ChatGPT JSON.

Validation order:

1. JSON must parse to a top-level object.
2. Required fields must be present and non-empty.
3. Zod validates the strict unit schema.
4. Chapter number must match the active target.
5. Word count is recomputed recursively by the server.
6. Minimum word count is checked against that recomputed value.

The AI-supplied `word_count` is not trusted; it is replaced with the server value.

A parseable object with gaps is useful work, so it is stored as `partial`. Only zero issues marks the unit `complete`.

## 7. Public publishing boundary

Catalogue metadata can exist before publication, but generated reader content is loaded only when `books.status = 'published'`. Because publication itself requires every unit to be complete, the reader never exposes partial production content.

The reader route performs the published check again server-side. It does not rely on a hidden client button.

## 8. Vengeance composition

BOOK owns layout, data, copy, palette, and content composition. Motion/component mechanics come from the pinned Vengeance UI source. See `VENGEANCE-MAPPING.md`.

The chapter reader is the intentional exception: it removes heavy UI motion and renders a stable paper surface.

## 9. Future extensions already left open

The schema/routes do not embed payment or auth assumptions. Later passes can add:

- user/account tables;
- purchase or membership entitlements;
- checkout provider events;
- reader progress/bookmarks;
- admin authentication/RBAC;
- cover asset storage/CDN;

Those additions can gate the existing public routes without changing the production unit model.
