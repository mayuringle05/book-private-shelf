# BOOK — Production UI 2026

This document records the production UI direction for the final public experience.

## Product feeling

BOOK should feel like a private editorial object, not a template marketplace, dashboard, AI landing page, or infinite content feed.

Principles:

- Editorial restraint over component density.
- Slow browsing over feed mechanics.
- Strong typography and negative space over decorative cards.
- Spatial 3D only where the physical-book metaphor benefits from it.
- Motion introduces hierarchy; it never competes with reading.
- Every public interaction should feel intentional on mobile, pointer, and keyboard.
- No fabricated ratings, testimonials, urgency, readership counts, or social proof.
- The reader remains deliberately quiet and paper-like.

## Typography system

Typography is intentionally split by job instead of using one family everywhere:

- **Instrument Serif** — brand display, hero statements, editorial headings, volume titles.
- **Geist** — navigation, controls, metadata, body UI, supporting copy, admin interface.
- **Geist Mono** — editorial indices, unit keys, structured/technical production data.
- **Newsreader** — long-form chapter reading and italic reading accents.

All fonts are self-hosted through version-pinned Fontsource packages. The application does not depend on a runtime font CDN or operating-system serif availability. A fluid type scale in `src/app/globals.css` controls display hierarchy across mobile and desktop.

## Color system

The production palette is intentionally narrow and warm:

- Obsidian: `#090807`
- Ivory Paper: `#F3EDE3`
- Editorial Ink: `#181411`
- Burnished Copper: `#C98762`
- Oxblood: `#682F2D`
- Tobacco: `#80634E`
- Warm Grey: `#AAA097`
- Hairlines: ivory at low opacity

Copper is the primary interaction/brand accent. Oxblood and Tobacco are supporting editorial colors used sparingly, including the founding-volume system. Purple and cool sage are not part of the site-wide UI palette.

The composition uses large typographic fields, thin rules, asymmetry, editorial indexing, and deliberate blank space. Vengeance UI remains the interaction source for animated backgrounds, text reveals, buttons, navigation, 3D books, search, loaders, admin cards, and footer.

## Public flow

1. Editorial hero: brand promise and one primary action.
2. Founding shelf: three spatial books, no fake ratings.
3. Proof of restraint: factual counters about the product system, not social proof.
4. Editorial principles: three disciplines presented as indexed rows, not generic cards.
5. Process: why books are published one at a time and why the reader stays quiet.
6. Honest FAQ.
7. Animated footer.

## Conversion rules

- One primary CTA per viewport zone.
- Search is immediately available from the catalogue and mobile navigation.
- Unpublished books may be discovered but never masquerade as available.
- Published books lead directly into the reader.
- No dark patterns, fake scarcity, fake ratings, or generated testimonial copy.

## Reader

The reader intentionally does not use heavy Vengeance motion. It uses an ivory paper surface, Newsreader for sustained reading, Instrument Serif for chapter hierarchy, a stable measure, generous leading, clear progress, and previous/next navigation. Reduced-motion preferences are respected globally.
