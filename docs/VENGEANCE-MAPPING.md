# Vengeance UI Mapping

Vengeance UI is the single source for animated interaction and styled component behavior. The registry source is pinned in `.vengeance-lock.json`.

| BOOK surface | Vengeance source | Implementation |
|---|---|---|
| Landing atmosphere | Aurora Hero | `src/components/site/hero.tsx` |
| Positioning headline reveal | Gooey Text Reveal | `src/components/site/hero.tsx` |
| Desktop nav | Spotlight Navbar | `src/components/site/site-nav.tsx` |
| Mobile nav | Glass Dock | `src/components/site/site-nav.tsx` |
| Main shelf | 3D Books Showcase | `src/components/site/shelf-experience.tsx` |
| Book pickup/open | Interactive Book | `src/components/site/book-entry.tsx` |
| Primary CTAs | Animated Button | public + admin actions |
| Catalogue search | Search Modal | `src/components/site/library-search.tsx` |
| Ambient secondary background | Fluid Morph Background | `src/components/site/atmosphere.tsx` |
| Route loading | Kinetic Text Loader | `src/app/loading.tsx` |
| Footer | Animated Footer | `src/components/site/site-footer.tsx` |
| Admin work packet | Generate Button | `src/components/admin/admin-console.tsx` |
| Admin status/progress cards | Glow Border Card | `src/components/admin/admin-console.tsx` |
| Admin unit status overview | Highlight Grid | `src/components/admin/admin-console.tsx` |
| Changing numeric progress | Animated Number | `src/components/admin/admin-console.tsx` |

## Components pinned for the full design vocabulary

The sync script also pulls the mapped catalogue components reserved for signed-off follow-up surfaces: Perspective Carousel, Candy Button, Radial Glow Button, Stats Counter, Testimonials Card, FAQ Accordion, Gooey Search, and Liquid Ocean.

They are deliberately not forced into the current UI when there is no honest product content for them. For example, the build does not invent fake testimonials simply to use Testimonials Card.

## Reader exception

`src/app/read/[slug]/[unit]/page.tsx` intentionally imports no Vengeance animation component and no motion library. The book animation is the entrance; the chapter is a quiet reading surface.
