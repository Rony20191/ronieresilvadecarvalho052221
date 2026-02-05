CREATE TYPE album_artist_role AS ENUM (
    'PRIMARY',
    'FEATURED',
    'PRODUCER',
    'COMPOSER'
);

CREATE TABLE album_artists (
   id UUID PRIMARY KEY,

   album_id UUID NOT NULL,
   artist_id UUID NOT NULL,

   role album_artist_role NOT NULL DEFAULT 'PRIMARY',

   created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_album_artists_album
       FOREIGN KEY (album_id)
           REFERENCES albums(id)
           ON DELETE CASCADE,

   CONSTRAINT fk_album_artists_artist
       FOREIGN KEY (artist_id)
           REFERENCES artists(id)
           ON DELETE CASCADE,

   CONSTRAINT uq_album_artist_role
       UNIQUE (album_id, artist_id, role)
);
