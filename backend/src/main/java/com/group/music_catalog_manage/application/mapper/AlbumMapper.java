package com.group.music_catalog_manage.application.mapper;

import com.group.music_catalog_manage.application.dto.response.AlbumCoverResponse;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.domain.model.Album;
import com.group.music_catalog_manage.domain.model.AlbumCover;

import java.util.List;

public final class AlbumMapper {

    public static AlbumResponse toResponse(
            Album album,
            AlbumCoverUrlProviderPort coverUrlProvider) {

        List<AlbumCoverResponse> coverResponses = album.getCovers().stream()
                .map(c -> new AlbumCoverResponse(
                        c.getFileKey(),   // ou c.getId() se o record tiver id
                        c.isPrimary(),
                        coverUrlProvider.generateUrl(c.getFileKey())
                ))
                .toList();

        List<ArtistResponse> artistResponses = album.getArtists().stream()
                .map(a -> ArtistResponse.builder()
                        .id(a.getId())
                        .name(a.getName())
                        .type(a.getType())
                        .formationYear(a.getFormationYear())
                        .biography(a.getBiography())
                        .createdAt(a.getCreatedAt())
                        .updatedAt(a.getUpdatedAt())
                        .build()
                )
                .toList();
        return new AlbumResponse(
                album.getId(),
                album.getTitle(),
                album.getDescription(),
                album.getReleaseYear(),
                coverResponses,
                artistResponses,
                album.getCreatedAt(),
                album.getUpdatedAt());
    }

    private static String resolveCoverUrl(
            Album album,
            AlbumCoverUrlProviderPort coverUrlProvider) {

        if (album.getCovers() == null || album.getCovers().isEmpty()) {
            return null;
        }

        AlbumCover cover = album.getCovers().stream()
                .filter(AlbumCover::isPrimary)
                .findFirst()
                .orElse(album.getCovers().get(0));

        return coverUrlProvider.generateUrl(cover.getFileKey());
    }

}
