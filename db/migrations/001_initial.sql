BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS books (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  positioning text NOT NULL,
  description text NOT NULL,
  voice_guide text NOT NULL,
  target_reader text NOT NULL,
  author_name text NOT NULL DEFAULT 'BOOK Editorial',
  cover_image text,
  accent_hex text NOT NULL DEFAULT '#C98A63',
  sort_order integer NOT NULL UNIQUE CHECK (sort_order > 0),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','in_progress','complete','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS books_one_in_progress_idx
  ON books ((status)) WHERE status = 'in_progress';

CREATE TABLE IF NOT EXISTS book_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id text NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  unit_key text NOT NULL,
  unit_type text NOT NULL CHECK (unit_type IN ('front_matter','chapter','back_matter')),
  unit_number integer,
  sequence integer NOT NULL CHECK (sequence >= 0),
  title_hint text,
  required_fields jsonb NOT NULL,
  output_schema jsonb NOT NULL,
  min_word_count integer NOT NULL DEFAULT 0 CHECK (min_word_count >= 0),
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','partial','complete')),
  content jsonb,
  computed_word_count integer NOT NULL DEFAULT 0,
  validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_id, unit_key),
  UNIQUE (book_id, sequence)
);

CREATE INDEX IF NOT EXISTS book_units_progress_idx ON book_units (book_id, sequence, status);

CREATE TABLE IF NOT EXISTS production_events (
  id bigserial PRIMARY KEY,
  book_id text REFERENCES books(id) ON DELETE SET NULL,
  unit_id uuid REFERENCES book_units(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS books_touch_updated_at ON books;
CREATE TRIGGER books_touch_updated_at BEFORE UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS book_units_touch_updated_at ON book_units;
CREATE TRIGGER book_units_touch_updated_at BEFORE UPDATE ON book_units
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

COMMIT;
