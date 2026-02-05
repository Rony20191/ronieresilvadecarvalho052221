import { ArtistType } from "./enums";

export { ArtistType };

export interface Artist {
    id: string;
    name: string;
    type: ArtistType;
    formationYear: number;
    biography: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateArtistRequest {
    name: string;
    type: ArtistType;
    formationYear?: number;
    biography?: string;
}

export interface UpdateArtistRequest extends CreateArtistRequest { }
