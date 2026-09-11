import { existsSync, readFileSync } from "node:fs";

const required = [
  "src/app/page.tsx",
  "src/app/library/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/api/admin/work-packet/route.ts",
  "src/app/api/admin/validate/route.ts",
  "src/app/api/admin/start/route.ts",
  "src/app/api/admin/publish/route.ts",
  "src/app/read/[slug]/[unit]/page.tsx",
  "src/components/site/shelf-experience.tsx",
  "src/components/site/book-entry.tsx",
  "src/components/admin/admin-console.tsx",
  "db/migrations/001_initial.sql",
  ".vengeance-lock.json"
];

const failures = [];
for (const file of required) if (!existsSync(file)) failures.push(`missing ${file}`);

const migration = readFileSync("db/migrations/001_initial.sql", "utf8");
if (!migration.includes("books_one_in_progress_idx")) failures.push("one-active-book DB invariant missing");
if (!migration.includes("UNIQUE (book_id, unit_key)")) failures.push("unit upsert uniqueness invariant missing");

const repository = readFileSync("src/lib/repository.ts", "utf8");
if (!repository.includes("status <> 'published'")) failures.push("prior-book publish lock missing");
if (!repository.includes("status <> 'complete' ORDER BY sequence LIMIT 1")) failures.push("smallest-incomplete-unit selector missing");
if (!repository.includes("Book must be complete before publishing.")) failures.push("manual publish completion gate missing");

const validation = readFileSync("src/lib/content-schema.ts", "utf8");
if (!validation.includes("recomputeWordCount")) failures.push("server word recount missing");
if (!/complete\s*:\s*deduped\.length\s*===\s*0/.test(validation)) failures.push("completion validation gate missing");
if (!/savable\s*:\s*true/.test(validation)) failures.push("partial-content persistence gate missing");

const admin = readFileSync("src/components/admin/admin-console.tsx", "utf8");
if (!admin.includes("Copy Work Packet") || !admin.includes("Paste &amp; Validate")) failures.push("two admin chapter actions missing");

const packet = readFileSync("src/lib/work-packet.ts", "utf8");
if (!packet.includes("repair_unit_gaps") || !packet.includes("existing_partial_content") || !packet.includes("validation_gaps")) failures.push("partial repair-gap packet behavior missing");

const publicReader = readFileSync("src/lib/reader-data.ts", "utf8");
if (!publicReader.includes('book.status !== "published"') || !publicReader.includes('unit.status !== "complete"')) failures.push("published reader boundary missing");

const sync = readFileSync("scripts/sync-vengeance.mjs", "utf8");
const uiImports = new Set();
for (const file of required.concat([
  "src/components/site/hero.tsx", "src/components/site/site-nav.tsx", "src/components/site/site-footer.tsx",
  "src/components/site/book-entry.tsx", "src/components/site/library-search.tsx", "src/components/site/atmosphere.tsx",
  "src/components/admin/admin-setup.tsx"
])) {
  if (!existsSync(file)) continue;
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/@\/components\/ui\/([a-z0-9-]+)/g)) uiImports.add(match[1]);
}
for (const name of uiImports) if (!sync.includes(`"${name}"`)) failures.push(`Vengeance sync is missing imported component ${name}`);

const reader = readFileSync("src/app/read/[slug]/[unit]/page.tsx", "utf8");
if (reader.includes("framer-motion") || reader.includes("components/ui/")) failures.push("reader contains heavy UI motion");

if (failures.length) {
  console.error("Contract check failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Contract check passed (${required.length} required artifacts + core invariants).`);
