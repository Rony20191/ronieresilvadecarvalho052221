package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.exceptions.AlbumNotFoundException;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.domain.model.Album;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class GetAlbumByIdUseCaseImpTest {

    @Mock
    private AlbumRepositoryPort albumRepositoryPort;

    @Mock
    private AlbumCoverUrlProviderPort albumCoverUrlProviderPort;

    @InjectMocks
    private GetAlbumByIdUseCaseImp getAlbumByIdUseCase;

    @Test
    @DisplayName("Should return album response when found")
    void shouldReturnAlbumResponseWhenFound() {
        UUID albumId = UUID.randomUUID();
        Album album = new Album();
        album.setId(albumId);
        album.setTitle("Test Album");
        album.setArtists(List.of());
        album.setCovers(List.of());

        given(albumRepositoryPort.findById(albumId)).willReturn(Optional.of(album));

        AlbumResponse response = getAlbumByIdUseCase.execute(albumId.toString());

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(albumId);
        assertThat(response.title()).isEqualTo("Test Album");
        verify(albumRepositoryPort).findById(albumId);
    }

    @Test
    @DisplayName("Should throw AlbumNotFoundException when album not found")
    void shouldThrowExceptionWhenAlbumNotFound() {
        UUID albumId = UUID.randomUUID();
        given(albumRepositoryPort.findById(albumId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> getAlbumByIdUseCase.execute(albumId.toString()))
                .isInstanceOf(AlbumNotFoundException.class)
                .hasMessage("Album not found with id: " + albumId);
    }
}