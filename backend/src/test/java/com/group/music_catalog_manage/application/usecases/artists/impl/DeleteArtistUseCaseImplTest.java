package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.exceptions.ArtistNotFoundException;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.domain.model.Artist;
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
class DeleteArtistUseCaseImplTest {

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @InjectMocks
    private DeleteArtistUseCaseImpl deleteArtistUseCase;

    @Test
    @DisplayName("Should delete artist successfully")
    void shouldDeleteArtistSuccessfully() {
        UUID artistId = UUID.randomUUID();
        Artist artist = new Artist();
        artist.setId(artistId);

        given(artistRepositoryPort.findById(artistId)).willReturn(Optional.of(artist));

        deleteArtistUseCase.execute(artistId);

        verify(artistRepositoryPort).findById(artistId);
        verify(artistRepositoryPort).deleteById(artistId);
    }

    @Test
    @DisplayName("Should throw ArtistNotFoundException when artist not found")
    void shouldThrowExceptionWhenArtistNotFound() {
        UUID artistId = UUID.randomUUID();
        given(artistRepositoryPort.findById(artistId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> deleteArtistUseCase.execute(artistId))
                .isInstanceOf(ArtistNotFoundException.class)
                .hasMessage("Artist not found with id: " + artistId);
    }
}