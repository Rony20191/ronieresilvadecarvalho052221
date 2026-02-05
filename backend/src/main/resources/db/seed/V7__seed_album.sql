-- Limpar dados existentes (opcional)
-- DELETE FROM albums;

-- Álbum 1: Abbey Road (The Beatles)
INSERT INTO albums (id, title, description, release_year, created_at, updated_at)
VALUES (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Abbey Road',
    'Abbey Road is the eleventh studio album by the English rock band the Beatles, released on 26 September 1969 by Apple Records.',
    1969,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Associação Album-Artista (The Beatles -> Abbey Road)
-- Role: MAIN_ARTIST
INSERT INTO album_artists (id, album_id, artist_id, role, created_at)
VALUES (
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', -- Album: Abbey Road
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Artist: The Beatles
    'PRIMARY',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- Álbum 2: 25 (Adele)
INSERT INTO albums (id, title, description, release_year, created_at, updated_at)
VALUES (
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66',
    '25',
    '25 is the third studio album by English singer-songwriter Adele, released on 20 November 2015 by XL Recordings.',
    2015,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Associação Album-Artista (Adele -> 25)
INSERT INTO album_artists (id, album_id, artist_id, role, created_at)
VALUES (
    'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380177',
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66', -- Album: 25
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', -- Artist: Adele
    'PRIMARY',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- Álbum 3: Master of Puppets (Metallica)
INSERT INTO albums (id, title, description, release_year, created_at, updated_at)
VALUES (
    'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380288',
    'Master of Puppets',
    'Master of Puppets is the third studio album by American heavy metal band Metallica, released on March 3, 1986, by Elektra Records.',
    1986,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Associação Album-Artista (Metallica -> Master of Puppets)
INSERT INTO album_artists (id, album_id, artist_id, role, created_at)
VALUES (
    'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380399',
    'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380288', -- Album: Master of Puppets
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', -- Artist: Metallica
    'PRIMARY',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Exemplo de Capa (Opcional, pois requer arquivo físico no MinIO se for validado)
-- INSERT INTO album_covers (id, album_id, file_key, is_primary, uploaded_at, created_at, updated_at)
-- VALUES (
--     'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380j00',
--     'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', -- Abbey Road
--     'covers/abbey_road.jpg',
--     true,
--     NOW(),
--     NOW(),
--     NOW()
-- );
