import { Artist, CreateArtistRequest, UpdateArtistRequest } from "@/core/types/artist";
import { PageRequest } from "@/core/types/page";
import { PageResponse } from "@/core/types/paginate";
import { api } from "./api";

export const ArtistService = {
    getAll: async (pageRequest: PageRequest, name?: string): Promise<PageResponse<Artist>> => {
        const params: Record<string, any> = {
            page: pageRequest.page,
            size: pageRequest.size,
            name: name || undefined,
        };

        if (pageRequest.sorts && pageRequest.sorts.length > 0) {
            params.sort = pageRequest.sorts.map(s => `${s.field},${s.direction}`);
        }


        return api.get<PageResponse<Artist>>("/api/v1/artists", params);
    },

    getById: async (id: string): Promise<Artist> => {
        return api.get<Artist>(`/api/v1/artists/${id}`);
    },

    create: async (request: CreateArtistRequest): Promise<Artist> => {
        return api.post<Artist>("/api/v1/artists", request);
    },

    update: async (id: string, request: UpdateArtistRequest): Promise<Artist> => {
        return api.put<Artist>(`/api/v1/artists/${id}`, request);
    },

    delete: async (id: string): Promise<void> => {
        return api.delete(`/api/v1/artists/${id}`);
    },
};
