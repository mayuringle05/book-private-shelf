import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Production surface only. Keep the synced registry minimal so unused demo components
// cannot pull extra runtime/type dependencies into clean builds.
const components = [
  "aurora-hero",
  "gooey-text-reveal",
  "spotlight-navbar",
  "glass-dock",
  "books-showcase",
  "interactive-book",
  "animated-button",
  "animated-number",
  "stats-counter",
  "faq-accordion",
  "search-modal",
  "fluid-morph-bg",
  "animated-footer",
  "kinetic-text-loader",
  "generate-button",
  "glow-border-card",
  "highlight-grid"
];

console.log(`Syncing ${components.length} production Vengeance UI components from the pinned upstream registry...`);
const result = spawnSync(
  "npm",
  ["exec", "--", "shadcn", "add", "--overwrite", ...components.map((name) => `@vengeanceui/${name}`)],
  { stdio: "inherit", shell: process.platform === "win32" },
);

if (result.status !== 0) process.exit(result.status ?? 1);

const generateButtonPath = resolve("src/components/ui/generate-button.tsx");
let generateSource = readFileSync(generateButtonPath, "utf8");
const originalGenerateSource = generateSource;

generateSource = generateSource
  .replace('{"Generate".split("")', '{"Copy Work Packet".split("")')
  .replace('{"Generating".split("")', '{"Copying Packet".split("")');

if (generateSource === originalGenerateSource) {
  throw new Error("Pinned Generate Button source changed unexpectedly; BOOK copy patch was not applied.");
}

writeFileSync(generateButtonPath, generateSource);
console.log("Vengeance UI synced from the locked registry commit. BOOK copy re-skin applied without changing animation logic.");
