-- Remove the incorrect unique constraint
ALTER TABLE album_covers DROP CONSTRAINT IF EXISTS uq_album_primary_cover;

-- Add a partial unique index that only enforces uniqueness for primary covers (is_primary = true)
-- This allows multiple secondary covers (is_primary = false) while ensuring only one primary cover per album
CREATE UNIQUE INDEX uq_album_primary_cover ON album_covers (album_id) WHERE is_primary = true;
