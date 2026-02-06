package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class FindByIdUseCaseImplTest {

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @InjectMocks
    private FindByIdUseCaseImpl findByIdUseCase;

    @Test
    @DisplayName("Should find artist by id successfully")
    void shouldFindArtistByIdSuccessfully() {
        UUID artistId = UUID.randomUUID();
        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setName("Test Artist");

        given(artistRepositoryPort.findById(artistId)).willReturn(Optional.of(artist));

        ArtistResponse response = findByIdUseCase.execute(artistId);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(artistId);
        assertThat(response.getName()).isEqualTo("Test Artist");
    }

    @Test
    @DisplayName("Should throw ArtistNotFoundException when artist not found")
    void shouldThrowExceptionWhenArtistNotFound() {
        UUID artistId = UUID.randomUUID();
        given(artistRepositoryPort.findById(artistId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> findByIdUseCase.execute(artistId))
                .isInstanceOf(ArtistNotFoundException.class)
                .hasMessage("Artist not found with id: " + artistId);
    }
}