package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.domain.model.Artist;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class FindAllArtistUseCaseImplTest {

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @InjectMocks
    private FindAllArtistUseCaseImpl findAllArtistUseCase;

    @Test
    @DisplayName("Should find all artists successfully")
    void shouldFindAllArtistsSuccessfully() {
        // Arrange
        String name = "Test";
        Pageable pageable = PageRequest.of(0, 10);
        Artist artist = new Artist();
        artist.setId(UUID.randomUUID());
        artist.setName("Test Artist");

        Page<Artist> artistPage = new PageImpl<>(List.of(artist));

        given(artistRepositoryPort.findByName(anyString(), any(Pageable.class))).willReturn(artistPage);

        // Act
        Page<ArtistResponse> result = findAllArtistUseCase.execute(name, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Test Artist");
    }
}
