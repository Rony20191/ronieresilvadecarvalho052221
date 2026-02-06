-- Limpar dados existentes (opcional, cuidado em produção)
-- DELETE FROM artists;

-- Artista 1: The Beatles (BANDA)
INSERT INTO artists (id, name, type, formation_year, biography, created_at, updated_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'The Beatles',
    'BAND',
    1960,
    'The Beatles were an English rock band formed in Liverpool in 1960. With a line-up comprising John Lennon, Paul McCartney, George Harrison and Ringo Starr, they are regarded as the most influential band of all time.',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Artista 2: Adele (SOLO)
INSERT INTO artists (id, name, type, formation_year, biography, created_at, updated_at)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'Adele',
    'SOLO',
    2006,
    'Adele Laurie Blue Adkins is an English singer and songwriter. After graduating from the BRIT School in 2006, she signed a record deal with XL Recordings.',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Artista 3: Metallica (BANDA)
INSERT INTO artists (id, name, type, formation_year, biography, created_at, updated_at)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'Metallica',
    'BAND',
    1981,
    'Metallica is an American heavy metal band. The band was formed in 1981 in Los Angeles by vocalist/guitarist James Hetfield and drummer Lars Ulrich.',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
