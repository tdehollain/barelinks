-- Migration: Update links table structure
-- Remove tags TEXT[] column from links table

BEGIN;

-- Remove the tags column from links table if it exists
ALTER TABLE links DROP COLUMN IF EXISTS tags;

COMMIT;