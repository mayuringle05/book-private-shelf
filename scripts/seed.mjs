import pg from "pg";
const { Client } = pg;
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");
const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false;
const client = new Client({ connectionString: url, ssl });
await client.connect();

const chapterSchema = {
  chapter_number: "number",
  title: "string",
  hook: "string",
  sections: [{ heading: "string", body: "string" }],
  examples: ["string"],
  exercise: { prompt: "string", reflection_questions: ["string"] },
  summary: "string",
  word_count: "number"
};
const frontSchema = { title: "string", opening_note: "string", reader_promise: "string", how_to_use_this_book: "string", word_count: "number" };
const backSchema = { title: "string", closing_note: "string", next_steps: ["string"], reflection_questions: ["string"], word_count: "number" };

const books = [
  { id:"magnetic-presence", title:"Magnetic Presence", subtitle:"Confidence people can feel before you say a word.", positioning:"Learn the signals that make presence feel calm, clear, and compelling.", description:"A practical guide to embodied confidence, social calibration, boundaries, and the quiet behaviors that make someone memorable without performing for attention.", voice:"Measured, perceptive, grounded, psychologically literate, never manipulative. Use concrete social examples. Respect consent and autonomy. Avoid pickup-artist language.", target:"Adults who want to become more socially confident and attractive without becoming performative or coercive.", accent:"#D59A74", order:1 },
  { id:"authentic-attraction", title:"Authentic Attraction", subtitle:"Connection without pretending to be someone else.", positioning:"Understand attraction while protecting honesty, agency, and self-respect.", description:"A field guide to chemistry, compatibility, communication, and how attraction grows when two people can read each other without games.", voice:"Warm, specific, honest, modern. No manipulation tactics. Treat rejection as useful information, not a problem to defeat.", target:"Adults dating intentionally who want practical attraction advice without scripts, games, or false bravado.", accent:"#9A7CC1", order:2 },
  { id:"modern-dating", title:"Modern Dating", subtitle:"A clearer map for apps, ambiguity, and real-world connection.", positioning:"Navigate modern dating with better judgment, communication, and emotional discipline.", description:"A contemporary playbook for profiles, first dates, pacing, exclusivity conversations, mixed signals, breakups, and preserving self-respect through uncertainty.", voice:"Direct, humane, contemporary, evidence-aware, balanced across genders and orientations, never cynical.", target:"Adults who want a calmer decision system for app dating and in-person relationships.", accent:"#6FA0A0", order:3 }
];

try {
  await client.query("BEGIN");
  for (const b of books) {
    await client.query(`INSERT INTO books (id, slug, title, subtitle, positioning, description, voice_guide, target_reader, accent_hex, sort_order)
       VALUES ($1,$1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, subtitle=EXCLUDED.subtitle, positioning=EXCLUDED.positioning,
       description=EXCLUDED.description, voice_guide=EXCLUDED.voice_guide, target_reader=EXCLUDED.target_reader,
       accent_hex=EXCLUDED.accent_hex, sort_order=EXCLUDED.sort_order`, [b.id,b.title,b.subtitle,b.positioning,b.description,b.voice,b.target,b.accent,b.order]);

    const units = [
      { key:"front:opening", type:"front_matter", number:null, sequence:0, title:"Opening note", required:["title","opening_note","reader_promise","how_to_use_this_book","word_count"], schema:frontSchema, min:700 },
      ...Array.from({ length: 8 }, (_, i) => ({ key:`chapter:${i + 1}`, type:"chapter", number:i + 1, sequence:i + 1, title:`Chapter ${i + 1}`, required:["chapter_number","title","hook","sections","examples","exercise","summary","word_count"], schema:chapterSchema, min:1800 })),
      { key:"back:closing", type:"back_matter", number:null, sequence:9, title:"Closing integration", required:["title","closing_note","next_steps","reflection_questions","word_count"], schema:backSchema, min:700 }
    ];

    for (const u of units) {
      await client.query(`INSERT INTO book_units (book_id, unit_key, unit_type, unit_number, sequence, title_hint, required_fields, output_schema, min_word_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9)
         ON CONFLICT (book_id, unit_key) DO UPDATE SET unit_type=EXCLUDED.unit_type, unit_number=EXCLUDED.unit_number,
         sequence=EXCLUDED.sequence, title_hint=EXCLUDED.title_hint, required_fields=EXCLUDED.required_fields,
         output_schema=EXCLUDED.output_schema, min_word_count=EXCLUDED.min_word_count`, [b.id,u.key,u.type,u.number,u.sequence,u.title,JSON.stringify(u.required),JSON.stringify(u.schema),u.min]);
    }
  }
  await client.query("COMMIT");
  console.log("Seed complete: 3 founding books + production schemas");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
