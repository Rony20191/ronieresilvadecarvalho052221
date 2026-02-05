CREATE TABLE album_covers (
      id UUID PRIMARY KEY,

      album_id UUID NOT NULL,

      file_key VARCHAR(255) NOT NULL,

      is_primary BOOLEAN NOT NULL DEFAULT FALSE,

      uploaded_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(6),

      CONSTRAINT fk_album_covers_album
          FOREIGN KEY (album_id)
              REFERENCES albums(id)
              ON DELETE CASCADE,

      CONSTRAINT uq_album_primary_cover
          UNIQUE (album_id, is_primary)
);

CREATE INDEX idx_covers_album_id ON album_covers (album_id);
CREATE INDEX idx_covers_file_key ON album_covers (file_key);