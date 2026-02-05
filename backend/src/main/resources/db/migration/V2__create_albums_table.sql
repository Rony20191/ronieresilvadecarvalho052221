CREATE TABLE albums (
                        id UUID PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,

                        artist_id UUID NOT NULL,

                        release_year INT,

                        created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP(6),

                        CONSTRAINT fk_albums_artist
                            FOREIGN KEY (artist_id)
                                REFERENCES artists(id)
                                ON DELETE CASCADE
);
