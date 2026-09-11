export type BookStatus = "queued" | "in_progress" | "complete" | "published";
export type UnitStatus = "not_started" | "partial" | "complete";
export type UnitType = "front_matter" | "chapter" | "back_matter";

export interface BookRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  positioning: string;
  description: string;
  voice_guide: string;
  target_reader: string;
  author_name: string;
  cover_image: string | null;
  accent_hex: string;
  sort_order: number;
  status: BookStatus;
  published_at: string | null;
}

export interface UnitRecord {
  id: string;
  book_id: string;
  unit_key: string;
  unit_type: UnitType;
  unit_number: number | null;
  sequence: number;
  title_hint: string | null;
  required_fields: string[];
  output_schema: Record<string, unknown>;
  min_word_count: number;
  status: UnitStatus;
  content: Record<string, unknown> | null;
  computed_word_count: number;
  validation_errors: ValidationIssue[];
}

export interface ValidationIssue { code: string; path?: string; message: string; }
export interface BookWithProgress extends BookRecord { total_units:number; complete_units:number; partial_units:number; progress_percent:number; locked:boolean; }
export interface DashboardSnapshot { books:BookWithProgress[]; activeBook:BookWithProgress|null; activeUnits:UnitRecord[]; nextUnit:UnitRecord|null; }
