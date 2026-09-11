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

function syncRegistry() {
  return spawnSync(
    "npm",
    ["exec", "--", "shadcn", "add", "--overwrite", ...components.map((name) => `@vengeanceui/${name}`)],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
}

console.log(`Syncing ${components.length} production Vengeance UI components from the pinned upstream registry...`);
let result;
for (let attempt = 1; attempt <= 4; attempt += 1) {
  result = syncRegistry();
  if (result.status === 0) break;
  if (attempt < 4) {
    const delaySeconds = attempt * 3;
    console.warn(`Vengeance registry sync attempt ${attempt} failed. Retrying in ${delaySeconds}s...`);
    spawnSync(process.platform === "win32" ? "timeout" : "sleep", [String(delaySeconds)], { stdio: "inherit" });
  }
}

if (!result || result.status !== 0) process.exit(result?.status ?? 1);

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

// Instrument Serif uses finer hairlines than the fallback serif used by the upstream demo.
// Vengeance's permanent 0.4px edge blur plus its alpha-threshold filter can erase those
// strokes entirely. Keep the same GSAP/SplitText/SVG-filter animation and only reduce the
// edge softening so the production editorial font remains visible.
const gooeyPath = resolve("src/components/ui/gooey-text-reveal.tsx");
let gooeySource = readFileSync(gooeyPath, "utf8");
const originalGooeySource = gooeySource;
gooeySource = gooeySource.replace("const LINE_EDGE_BLUR = 0.4;", "const LINE_EDGE_BLUR = 0.08;");

if (gooeySource === originalGooeySource) {
  throw new Error("Pinned Gooey Text Reveal source changed unexpectedly; BOOK serif-compatibility patch was not applied.");
}

writeFileSync(gooeyPath, gooeySource);
console.log("Vengeance UI synced from the locked registry commit. BOOK copy and editorial-serif compatibility patches applied without replacing upstream animation logic.");
