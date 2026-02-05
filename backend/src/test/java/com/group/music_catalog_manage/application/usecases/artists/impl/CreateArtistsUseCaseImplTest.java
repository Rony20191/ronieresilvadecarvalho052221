package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.request.CreateArtistRequest;
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
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CreateArtistsUseCaseImplTest {

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @InjectMocks
    private CreateArtistsUseCaseImpl createArtistsUseCase;

    @Test
    @DisplayName("Should create artist successfully")
    void shouldCreateArtistSuccessfully() {
        // Arrange
        CreateArtistRequest request = new CreateArtistRequest();
        request.setName("Test Artist");
        request.setType(ArtistType.SOLO);
        request.setFormationYear(2000);
        request.setBiography("Test Biography");

        UUID artistId = UUID.randomUUID();
        Artist savedArtist = new Artist(request.getName(), request.getType(), request.getFormationYear(),
                request.getBiography());
        savedArtist.setId(artistId);

        given(artistRepositoryPort.save(any(Artist.class))).willReturn(savedArtist);

        // Act
        ArtistResponse response = createArtistsUseCase.execute(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(artistId);
        assertThat(response.getName()).isEqualTo(request.getName());
        assertThat(response.getType()).isEqualTo(request.getType());

        verify(artistRepositoryPort).save(any(Artist.class));
    }
}
