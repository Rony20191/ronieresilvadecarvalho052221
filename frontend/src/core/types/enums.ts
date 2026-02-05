export enum ArtistType {
    SOLO = 'SOLO',
    BAND = 'BAND',
    DUO = 'DUO',
    ORCHESTRA = 'ORCHESTRA',
    CHOIR = 'CHOIR',
    DJ = 'DJ'
}

export enum CollaborationRole {
    MAIN = 'MAIN',
    FEATURED = 'FEATURED',
    PRODUCER = 'PRODUCER',
    COMPOSER = 'COMPOSER'
}

export const ArtistTypeLabels: Record<string, string> = {
    [ArtistType.SOLO]: 'Solo',
    [ArtistType.BAND]: 'Banda',
    [ArtistType.DUO]: 'Duo',
    [ArtistType.ORCHESTRA]: 'Orquestra',
    [ArtistType.CHOIR]: 'Coral',
    [ArtistType.DJ]: 'DJ'
};
