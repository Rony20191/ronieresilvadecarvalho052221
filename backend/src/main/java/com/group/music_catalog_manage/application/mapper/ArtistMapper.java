package com.group.music_catalog_manage.application.mapper;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.domain.model.Artist;

public final class ArtistMapper {
    public static ArtistResponse toResponse(Artist artist) {
        return ArtistResponse.builder()
                .id(artist.getId())
                .name(artist.getName())
                .type(artist.getType())
                .formationYear(artist.getFormationYear())
                .biography(artist.getBiography())
                .createdAt(artist.getCreatedAt())
                .updatedAt(artist.getUpdatedAt())
                .build();
    }
}
