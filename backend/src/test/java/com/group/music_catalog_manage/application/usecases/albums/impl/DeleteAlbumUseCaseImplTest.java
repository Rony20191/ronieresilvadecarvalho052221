package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.domain.model.Album;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class DeleteAlbumUseCaseImplTest {

    @Mock
    private AlbumRepositoryPort albumRepositoryPort;

    @InjectMocks
    private DeleteAlbumUseCaseImpl deleteAlbumUseCase;

    @Test
    @DisplayName("Should delete album successfully")
    void shouldDeleteAlbumSuccessfully() {
        // Arrange
        UUID albumId = UUID.randomUUID();
        Album album = new Album();
        album.setId(albumId);

        given(albumRepositoryPort.findById(albumId)).willReturn(Optional.of(album));

        // Act
        deleteAlbumUseCase.execute(albumId.toString());

        // Assert
        verify(albumRepositoryPort).findById(albumId);
        verify(albumRepositoryPort).deleteById(albumId);
    }

    @Test
    @DisplayName("Should throw exception when album not found")
    void shouldThrowExceptionWhenAlbumNotFound() {
        // Arrange
        UUID albumId = UUID.randomUUID();
        given(albumRepositoryPort.findById(albumId)).willReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> deleteAlbumUseCase.execute(albumId.toString()))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Album not found with id: " + albumId);
    }
}
