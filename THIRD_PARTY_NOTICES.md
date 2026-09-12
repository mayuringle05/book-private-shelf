# Third-party notices

## Vengeance UI

BOOK uses source-distributed UI components from the Vengeance UI project (`Ashutoshx7/VengeanceUI`) through its public shadcn-compatible registry. This repository pins the source commit in `.vengeance-lock.json` and vendors the production component source so deploys are deterministic.

Upstream license and attribution remain governed by the Vengeance UI repository. Preserve upstream notices when distributing vendored component source.

## Typography / Fontsource

BOOK self-hosts its production typography through Fontsource npm packages. Fontsource packaging/tooling is maintained by the Fontsource project; individual font software remains under its own license.

The production type system uses:

- **Instrument Serif** — Instrument Serif Project Authors — SIL Open Font License 1.1.
- **Geist** — The Geist Project Authors — SIL Open Font License 1.1.
- **Geist Mono** — The Geist Project Authors — SIL Open Font License 1.1.
- **Newsreader** — Newsreader Project Authors — SIL Open Font License 1.1.

The font packages are version-pinned in `package.json` and bundled/self-hosted by the application build. Do not extract or redistribute font binaries separately from their applicable license terms.
