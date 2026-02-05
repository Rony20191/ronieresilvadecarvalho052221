import { Artist } from "./artist";

export interface AlbumCover {
    fileKey: string;
    primary: boolean;
    presignedUrl?: string;
}

export interface Album {
    id: string;
    title: string;
    description: string;
    releaseYear: number;
    covers: AlbumCover[];
    artists: Artist[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAlbumRequest {
    title: string;
    description: string;
    releaseYear: number;
    artistIds: string[];
}

export interface UpdateAlbumRequest {
    title: string;
    description: string;
    releaseYear: number;
    artistIds?: string[];
}

