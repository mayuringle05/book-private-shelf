# Vengeance UI — Production Mapping

Vengeance UI is the single source for animated interaction and styled motion behavior in BOOK. The registry URL is pinned to the exact upstream commit recorded in `.vengeance-lock.json` and `components.json`.

## Live production surfaces

| BOOK surface | Vengeance source | Implementation |
|---|---|---|
| Landing atmosphere | Aurora Hero | `src/components/site/hero.tsx` |
| Hero statement reveal | Gooey Text Reveal | `src/components/site/hero.tsx` |
| Desktop navigation | Spotlight Navbar | `src/components/site/site-nav.tsx` |
| Mobile navigation | Glass Dock | `src/components/site/site-nav.tsx` |
| Spatial founding shelf | 3D Books Showcase | `src/components/site/shelf-experience.tsx` |
| Book pickup / opening | Interactive Book | `src/components/site/book-entry.tsx` |
| Primary public + admin actions | Animated Button | public + admin surfaces |
| Catalogue command search | Search Modal | `src/components/site/library-search.tsx` |
| Editorial atmosphere | Fluid Morph Background | `src/components/site/atmosphere.tsx` |
| Product-system facts | Stats Counter | `src/app/page.tsx` |
| Honest pre-entry questions | FAQ Accordion | `src/app/page.tsx` |
| Route loading | Kinetic Text Loader | `src/app/loading.tsx` |
| Closing brand movement | Animated Footer | `src/components/site/site-footer.tsx` |
| Admin work-packet action | Generate Button | `src/components/admin/admin-console.tsx` |
| Admin production cards | Glow Border Card | `src/components/admin/admin-console.tsx` |
| Admin unit overview | Highlight Grid | `src/components/admin/admin-console.tsx` |
| Admin progress number | Animated Number | `src/components/admin/admin-console.tsx` |

## Production sync policy

`scripts/sync-vengeance.mjs` syncs only components used by a production surface. Unused Vengeance demos are intentionally excluded from the clean-build dependency graph until a real product surface needs them.

The project does **not** add fake testimonials, ratings, Goodreads signals, purchase controls, audiobook controls, readership numbers, or urgency merely to exercise a component. In particular, BOOK uses `BooksShowcase` with its built-in detail commerce panel disabled; the 3D shelf remains Vengeance-owned while BOOK renders the truthful selected-volume action below it.

The only source patch applied after registry sync is the visible operator copy inside Vengeance Generate Button:

- `Generate` → `Copy Work Packet`
- `Generating` → `Copying Packet`

The sync script fails if the pinned upstream source changes enough that this copy patch cannot be applied safely.

## Composition rule

BOOK owns product copy, information architecture, data, typography, palette, spacing, and editorial composition. Vengeance owns motion/component mechanics. Static editorial rules and layout structure are normal application layout; animated backgrounds, buttons, navigation, 3D book behavior, loaders, and status motion come from Vengeance.

## Reader exception

`src/app/read/[slug]/[unit]/page.tsx` intentionally imports no Vengeance animation component and no motion library. The physical-book motion is the entrance; the chapter itself is a stable paper reading surface with a simple progress indicator and previous/next navigation.
