import { Album, CreateAlbumRequest, UpdateAlbumRequest } from "@/core/types/album";
import { PageRequest } from "@/core/types/page";
import { PageResponse } from "@/core/types/paginate";
import { api } from "./api";

export const AlbumService = {
    getAll: async (pageRequest: PageRequest, title?: string, artistId?: string): Promise<PageResponse<Album>> => {
        const params: Record<string, any> = {
            page: pageRequest.page,
            size: pageRequest.size,
            albumTitle: title || undefined,
            artistId: artistId || undefined,
        };

        if (pageRequest.sorts && pageRequest.sorts.length > 0) {
            params.sort = pageRequest.sorts.map(s => `${s.field},${s.direction}`);
        }

        return api.get<PageResponse<Album>>("/api/v1/albums", params);
    },

    getById: async (id: string): Promise<Album> => {
        return api.get<Album>(`/api/v1/albums/${id}`);
    },

    create: async (request: CreateAlbumRequest, covers?: File[]): Promise<Album> => {
        const formData = new FormData();

        formData.append("title", request.title);
        formData.append("description", request.description);
        formData.append("releaseYear", request.releaseYear.toString());

        request.artistIds.forEach(id => {
            formData.append("artistIds", id);
        });

        if (covers && covers.length > 0) {
            covers.forEach(cover => {
                formData.append("cover", cover);
            });
        }

        return api.post<Album>("/api/v1/albums", formData, true);
    },

    update: async (id: string, request: UpdateAlbumRequest, covers?: File[]): Promise<Album> => {
        const formData = new FormData();

        formData.append("title", request.title);
        formData.append("description", request.description);
        formData.append("releaseYear", request.releaseYear.toString());

        if (request.artistIds && request.artistIds.length > 0) {
            request.artistIds.forEach(id => {
                formData.append("artistIds", id);
            });
        }

        if (request.coverIdsToRemove && request.coverIdsToRemove.length > 0) {
            request.coverIdsToRemove.forEach(id => {
                formData.append("coverIdsToRemove", id);
            });
        }

        if (covers && covers.length > 0) {
            covers.forEach(cover => {
                formData.append("cover", cover);
            });
        }

        return api.put<Album>(`/api/v1/albums/${id}`, formData, true);
    },

    delete: async (id: string): Promise<void> => {
        return api.delete(`/api/v1/albums/${id}`);
    },
};
