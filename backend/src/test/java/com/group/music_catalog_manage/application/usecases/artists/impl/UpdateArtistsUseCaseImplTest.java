package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.request.UpdateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.domain.model.Artist;
import com.group.music_catalog_manage.domain.model.ArtistType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class UpdateArtistsUseCaseImplTest {

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @InjectMocks
    private UpdateArtistsUseCaseImpl updateArtistsUseCase;

    @Test
    @DisplayName("Should update artist successfully")
    void shouldUpdateArtistSuccessfully() {
        // Arrange
        UUID artistId = UUID.randomUUID();
        UpdateArtistRequest request = new UpdateArtistRequest();
        request.setName("Updated Artist");
        request.setType(ArtistType.BAND);
        request.setFormationYear(2010);
        request.setBiography("Updated Biography");

        Artist updatedArtist = new Artist();
        updatedArtist.setId(artistId);
        updatedArtist.setName(request.getName());
        updatedArtist.setType(request.getType());

        given(artistRepositoryPort.update(eq(artistId), any(Artist.class))).willReturn(updatedArtist);

        // Act
        ArtistResponse response = updateArtistsUseCase.execute(artistId, request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(artistId);
        assertThat(response.getName()).isEqualTo(request.getName());
    }
}
