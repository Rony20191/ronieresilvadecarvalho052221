CREATE TYPE artist_type AS ENUM (
  'SOLO',
  'BAND',
  'DUO',
  'ORCHESTRA',
  'CHOIR',
  'DJ'
);


CREATE TABLE artists (
             id UUID PRIMARY KEY,
             name VARCHAR(255) NOT NULL,

             type artist_type NOT NULL DEFAULT 'SOLO',

             formation_year INT,
             biography TEXT,

             created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMP(6)
);
