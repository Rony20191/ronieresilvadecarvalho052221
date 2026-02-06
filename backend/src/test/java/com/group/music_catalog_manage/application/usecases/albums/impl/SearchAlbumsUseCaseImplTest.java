package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.request.SearchAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.domain.model.Album;
import com.group.music_catalog_manage.domain.model.AlbumArtist;
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
class SearchAlbumsUseCaseImplTest {

    @Mock
    private AlbumRepositoryPort albumRepositoryPort;

    @Mock
    private ArtistRepositoryPort artistRepositoryPort;

    @Mock
    private AlbumCoverUrlProviderPort albumCoverUrlProviderPort;

    @Mock
    private AlbumCoverUrlProviderPort coverUrlProvider;

    @InjectMocks
    private SearchAlbumsUseCaseImpl searchAlbumsUseCase;

    @Test
    @DisplayName("Should search albums successfully")
    void shouldSearchAlbumsSuccessfully() {
        SearchAlbumRequest request = new SearchAlbumRequest("Test", null, null, null, null, null);
        Pageable pageable = PageRequest.of(0, 10);

        UUID albumId = UUID.randomUUID();
        UUID artistId = UUID.randomUUID();

        Album album = new Album();
        album.setId(albumId);
        album.setTitle("Test Album");
        album.setReleaseYear(2023);

        AlbumArtist albumArtist = new AlbumArtist(UUID.randomUUID(), albumId, artistId, null);
        album.setAlbumArtists(List.of(albumArtist));
        album.setCovers(List.of());

        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setName("Test Artist");

        Page<Album> albumPage = new PageImpl<>(List.of(album), pageable, 1);

        given(albumRepositoryPort.findByTitle(anyString(), any(Pageable.class))).willReturn(albumPage);
        given(artistRepositoryPort.findByIds(any())).willReturn(List.of(artist));

        Page<AlbumResponse> result = searchAlbumsUseCase.execute(request, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).title()).isEqualTo("Test Album");
        assertThat(result.getContent().get(0).artists()).hasSize(1);
        assertThat(result.getContent().get(0).artists().get(0).getName()).isEqualTo("Test Artist");
    }
}