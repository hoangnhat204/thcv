-- Neon/PostgreSQL schema for the Rainbow School application.
-- Run this file once in the Neon SQL Editor.
CREATE TABLE IF NOT EXISTS school_directory (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  names JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  plot_index INTEGER NOT NULL CHECK (plot_index >= 0),
  flower_id TEXT NOT NULL,
  stage SMALLINT NOT NULL DEFAULT 0 CHECK (stage BETWEEN 0 AND 5),
  grower_name TEXT NOT NULL DEFAULT '',
  grower_school TEXT NOT NULL DEFAULT '',
  grower_message TEXT NOT NULL DEFAULT '',
  planted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (room_id, plot_index)
);

CREATE INDEX IF NOT EXISTS plants_room_id_idx ON plants (room_id);
CREATE INDEX IF NOT EXISTS plants_planted_at_idx ON plants (planted_at DESC);

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  file_name TEXT NOT NULL DEFAULT '',
  mime_type TEXT NOT NULL DEFAULT 'text/plain',
  content TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS books_uploaded_at_idx ON books (uploaded_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS plants_set_updated_at ON plants;
CREATE TRIGGER plants_set_updated_at
BEFORE UPDATE ON plants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
