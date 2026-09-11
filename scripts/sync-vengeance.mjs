import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const components = [
  "aurora-hero",
  "gooey-text-reveal",
  "spotlight-navbar",
  "glass-dock",
  "books-showcase",
  "interactive-book",
  "perspective-carousel",
  "animated-button",
  "candy-button",
  "radial-glow-button",
  "animated-number",
  "stats-counter",
  "testimonials-card",
  "faq-accordion",
  "search-modal",
  "gooey-search",
  "liquid-ocean",
  "fluid-morph-bg",
  "animated-footer",
  "kinetic-text-loader",
  "generate-button",
  "glow-border-card",
  "highlight-grid"
];

const args = ["--yes", "shadcn@latest", "add", "--overwrite", ...components.map((name) => `@vengeanceui/${name}`)];
console.log(`Syncing ${components.length} Vengeance UI components from the pinned upstream registry...`);
const result = spawnSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
if (result.status !== 0) process.exit(result.status ?? 1);

const generateButtonPath = resolve("src/components/ui/generate-button.tsx");
let generateSource = readFileSync(generateButtonPath, "utf8");
generateSource = generateSource
  .replace('{"Generate".split("")', '{"Copy Work Packet".split("")')
  .replace('{"Generating".split("")', '{"Copying Packet".split("")');
writeFileSync(generateButtonPath, generateSource);

console.log("Vengeance UI synced. BOOK copy re-skin applied; animation logic remains upstream source.");
