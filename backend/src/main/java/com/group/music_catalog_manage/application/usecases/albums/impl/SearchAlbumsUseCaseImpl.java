package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.request.SearchAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumCoverResponse;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.usecases.albums.SearchAlbumsUseCase;
import com.group.music_catalog_manage.domain.model.*;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SearchAlbumsUseCaseImpl implements SearchAlbumsUseCase {
        private final AlbumCoverUrlProviderPort albumCoverUrlProviderPort;
        private final AlbumRepositoryPort albumRepositoryPort;
        private final ArtistRepositoryPort artistRepositoryPort;
        private final AlbumCoverUrlProviderPort coverUrlProvider;

        public Page<AlbumResponse> execute(SearchAlbumRequest request, Pageable pageable) {

                Page<Album> albums = albumRepositoryPort.findByTitle(request.albumTitle(), pageable);
                return albums.map(album -> {

                        List<UUID> artistIds = album.getAlbumArtists().stream()
                                        .map(AlbumArtist::getArtistId)
                                        .toList();

                        List<ArtistResponse> artistResponses = artistRepositoryPort.findByIds(artistIds).stream()
                                        .map(a -> ArtistResponse.builder()
                                                        .id(a.getId())
                                                        .name(a.getName())
                                                        .type(a.getType())
                                                        .formationYear(a.getFormationYear())
                                                        .biography(a.getBiography())
                                                        .createdAt(a.getCreatedAt())
                                                        .updatedAt(a.getUpdatedAt())
                                                        .build())
                                        .toList();

                        List<AlbumCoverResponse> coverResponses = album.getCovers().stream()
                                        .map(c -> new AlbumCoverResponse(
                                                        c.getId(),
                                                        c.getFileKey(),
                                                        c.isPrimary(),
                                                        coverUrlProvider.generateUrl(c.getFileKey())))
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
                });
        }
}
