import type { PoolClient } from "pg";
import { getPool } from "@/lib/db";
import type { BookRecord, BookWithProgress, DashboardSnapshot, UnitRecord, ValidationIssue } from "@/lib/types";

function toBook(row: Record<string, unknown>): BookRecord {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title),
    subtitle: row.subtitle == null ? null : String(row.subtitle), positioning: String(row.positioning),
    description: String(row.description), voice_guide: String(row.voice_guide), target_reader: String(row.target_reader),
    author_name: String(row.author_name), cover_image: row.cover_image == null ? null : String(row.cover_image),
    accent_hex: String(row.accent_hex), sort_order: Number(row.sort_order), status: row.status as BookRecord["status"],
    published_at: row.published_at == null ? null : new Date(String(row.published_at)).toISOString(),
  };
}

function toBookWithProgress(row: Record<string, unknown>): BookWithProgress {
  const book = toBook(row);
  const total = Number(row.total_units ?? 0);
  const complete = Number(row.complete_units ?? 0);
  return { ...book, total_units: total, complete_units: complete, partial_units: Number(row.partial_units ?? 0), progress_percent: total === 0 ? 0 : Math.round((complete / total) * 100), locked: Boolean(row.locked) };
}

function toUnit(row: Record<string, unknown>): UnitRecord {
  return {
    id: String(row.id), book_id: String(row.book_id), unit_key: String(row.unit_key), unit_type: row.unit_type as UnitRecord["unit_type"],
    unit_number: row.unit_number == null ? null : Number(row.unit_number), sequence: Number(row.sequence),
    title_hint: row.title_hint == null ? null : String(row.title_hint), required_fields: (row.required_fields ?? []) as string[],
    output_schema: (row.output_schema ?? {}) as Record<string, unknown>, min_word_count: Number(row.min_word_count),
    status: row.status as UnitRecord["status"], content: (row.content ?? null) as Record<string, unknown> | null,
    computed_word_count: Number(row.computed_word_count ?? 0), validation_errors: (row.validation_errors ?? []) as ValidationIssue[],
  };
}

const PROGRESS_SQL = `
  SELECT b.*,
    COUNT(u.id)::int AS total_units,
    COUNT(u.id) FILTER (WHERE u.status = 'complete')::int AS complete_units,
    COUNT(u.id) FILTER (WHERE u.status = 'partial')::int AS partial_units,
    EXISTS (SELECT 1 FROM books prev WHERE prev.sort_order < b.sort_order AND prev.status <> 'published') AS locked
  FROM books b LEFT JOIN book_units u ON u.book_id = b.id
`;

export async function listBooksWithProgress() {
  const { rows } = await getPool().query(`${PROGRESS_SQL} GROUP BY b.id ORDER BY b.sort_order`);
  return rows.map(toBookWithProgress);
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const books = await listBooksWithProgress();
  const activeBook = books.find((book) => book.status === "in_progress") ?? null;
  if (!activeBook) return { books, activeBook: null, activeUnits: [], nextUnit: null };
  const { rows } = await getPool().query(`SELECT * FROM book_units WHERE book_id=$1 ORDER BY sequence`, [activeBook.id]);
  const activeUnits = rows.map(toUnit);
  return { books, activeBook, activeUnits, nextUnit: activeUnits.find((unit) => unit.status !== "complete") ?? null };
}

export async function getBookBySlug(slug: string) {
  const { rows } = await getPool().query(`${PROGRESS_SQL} WHERE b.slug=$1 GROUP BY b.id`, [slug]);
  return rows[0] ? toBookWithProgress(rows[0]) : null;
}

export async function getBookUnits(bookId: string, onlyComplete = false) {
  const { rows } = await getPool().query(`SELECT * FROM book_units WHERE book_id=$1 ${onlyComplete ? "AND status='complete'" : ""} ORDER BY sequence`, [bookId]);
  return rows.map(toUnit);
}

export async function getUnitByKey(bookId: string, unitKey: string) {
  const { rows } = await getPool().query(`SELECT * FROM book_units WHERE book_id=$1 AND unit_key=$2`, [bookId, unitKey]);
  return rows[0] ? toUnit(rows[0]) : null;
}

export async function getActiveProductionTarget() {
  const { rows: bookRows } = await getPool().query(`SELECT * FROM books WHERE status='in_progress' LIMIT 1`);
  if (!bookRows[0]) return null;
  const book = toBook(bookRows[0]);
  const { rows: unitRows } = await getPool().query(`SELECT * FROM book_units WHERE book_id=$1 AND status <> 'complete' ORDER BY sequence LIMIT 1`, [book.id]);
  return { book, unit: unitRows[0] ? toUnit(unitRows[0]) : null };
}

export async function startBookProduction(bookId: string) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(740001)");
    const { rows } = await client.query(`SELECT * FROM books WHERE id=$1 FOR UPDATE`, [bookId]);
    if (!rows[0]) throw new Error("Book not found.");
    const book = toBook(rows[0]);
    if (book.status !== "queued") throw new Error("Only queued books can start production.");
    const active = await client.query(`SELECT id FROM books WHERE status='in_progress' LIMIT 1`);
    if (active.rows[0]) throw new Error("Another book is already in production.");
    const prior = await client.query(`SELECT id,title,status FROM books WHERE sort_order < $1 AND status <> 'published' ORDER BY sort_order`, [book.sort_order]);
    if (prior.rows[0]) throw new Error(`Locked until ${prior.rows[0].title} is published.`);
    await client.query(`UPDATE books SET status='in_progress' WHERE id=$1`, [bookId]);
    await client.query(`INSERT INTO production_events (book_id,event_type,detail) VALUES ($1,'book_started','{}')`, [bookId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

export async function saveUnitValidation(args: { unit: UnitRecord; content: Record<string, unknown>; computedWordCount: number; complete: boolean; issues: ValidationIssue[] }) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const status = args.complete ? "complete" : "partial";
    await client.query(`UPDATE book_units SET content=$2::jsonb, computed_word_count=$3, validation_errors=$4::jsonb, status=$5, completed_at=CASE WHEN $5='complete' THEN now() ELSE NULL END WHERE id=$1`, [args.unit.id, JSON.stringify(args.content), args.computedWordCount, JSON.stringify(args.issues), status]);
    await client.query(`INSERT INTO production_events (book_id,unit_id,event_type,detail) VALUES ($1,$2,$3,$4::jsonb)`, [args.unit.book_id, args.unit.id, args.complete ? "unit_completed" : "unit_partial", JSON.stringify({ word_count: args.computedWordCount, issues: args.issues })]);
    await recomputeBookStatus(client, args.unit.book_id);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

async function recomputeBookStatus(client: PoolClient, bookId: string) {
  const { rows } = await client.query(`SELECT b.status, COUNT(u.id)::int AS total, COUNT(u.id) FILTER (WHERE u.status='complete')::int AS complete FROM books b LEFT JOIN book_units u ON u.book_id=b.id WHERE b.id=$1 GROUP BY b.id`, [bookId]);
  if (!rows[0] || rows[0].status === "published") return;
  const allComplete = Number(rows[0].total) > 0 && Number(rows[0].total) === Number(rows[0].complete);
  await client.query(`UPDATE books SET status=$2 WHERE id=$1`, [bookId, allComplete ? "complete" : "in_progress"]);
}

export async function publishBook(bookId: string) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(`SELECT * FROM books WHERE id=$1 FOR UPDATE`, [bookId]);
    if (!rows[0]) throw new Error("Book not found.");
    const book = toBook(rows[0]);
    if (book.status !== "complete") throw new Error("Book must be complete before publishing.");
    const incomplete = await client.query(`SELECT unit_key FROM book_units WHERE book_id=$1 AND status <> 'complete' LIMIT 1`, [bookId]);
    if (incomplete.rows[0]) throw new Error(`Cannot publish: ${incomplete.rows[0].unit_key} is incomplete.`);
    await client.query(`UPDATE books SET status='published', published_at=now() WHERE id=$1`, [bookId]);
    await client.query(`INSERT INTO production_events (book_id,event_type,detail) VALUES ($1,'book_published','{}')`, [bookId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

export async function getPublishedOrCatalogBooks() { return listBooksWithProgress(); }
