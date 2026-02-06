package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.request.UpdateAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.storage.FileStoragePort;
import com.group.music_catalog_manage.domain.model.Album;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UpdateAlbumUseCaseImpTest {

    @Mock
    private AlbumRepositoryPort albumRepositoryPort;

    @Mock
    private AlbumCoverUrlProviderPort albumCoverUrlProviderPort;

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @Mock
    private FileStoragePort fileStoragePort;

    @InjectMocks
    private UpdateAlbumUseCaseImp updateAlbumUseCase;

    @Test
    @DisplayName("Should update album successfully")
    void shouldUpdateAlbumSuccessfully() {
        UUID albumId = UUID.randomUUID();
        UpdateAlbumRequest request = new UpdateAlbumRequest();
        request.setTitle("Updated Title");
        request.setDescription("Updated Description");
        request.setReleaseYear(2024);
        List<UUID> artistIds = Collections.emptyList();

        Album existingAlbum = new Album();
        existingAlbum.setId(albumId);

        Album updatedAlbum = new Album();
        updatedAlbum.setId(albumId);
        updatedAlbum.setTitle(request.getTitle());
        updatedAlbum.setDescription(request.getDescription());
        updatedAlbum.setReleaseYear(request.getReleaseYear());
        updatedAlbum.setArtists(List.of());
        updatedAlbum.setCovers(List.of());

        given(albumRepositoryPort.findById(albumId)).willReturn(Optional.of(existingAlbum));
        given(artistRepositoryPort.findByIds(any())).willReturn(Collections.emptyList());
        given(albumRepositoryPort.save(any(Album.class))).willReturn(updatedAlbum);

        AlbumResponse response = updateAlbumUseCase.execute(
                albumId,
                request.getTitle(),
                artistIds,
                request.getDescription(),
                request.getReleaseYear(),
                null // covers
        );

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(albumId);
        assertThat(response.title()).isEqualTo(request.getTitle());
        assertThat(response.description()).isEqualTo(request.getDescription());
        assertThat(response.releaseYear()).isEqualTo(request.getReleaseYear());

        verify(albumRepositoryPort).save(any(Album.class));
    }
}