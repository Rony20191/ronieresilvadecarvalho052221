package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.storage.FileStoragePort;
import com.group.music_catalog_manage.domain.model.Album;
import com.group.music_catalog_manage.domain.model.Artist;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CreateAlbumUseCaseImplTest {

    @Mock
    private AlbumRepositoryPort albumRepositoryPort;
    @Mock
    private AlbumCoverUrlProviderPort albumCoverUrlProviderPort;
    @Mock
    private FileStoragePort fileStoragePort;
    @Mock
    private ArtistRepositoryPort artistRepositoryPort;
    @Mock
    private MultipartFile coverFile;

    @InjectMocks
    private CreateAlbumUseCaseImpl createAlbumUseCase;

    @Test
    @DisplayName("Should create album successfully with covers")
    void shouldCreateAlbumSuccessfullyWithCovers() throws Exception {
        // Arrange
        String title = "Test Album";
        UUID artistId = UUID.randomUUID();
        String description = "Test Description";
        Integer releaseYear = 2023;
        List<UUID> artistIds = List.of(artistId);
        List<MultipartFile> covers = List.of(coverFile);

        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setName("Test Artist");

        given(artistRepositoryPort.findByIds(artistIds)).willReturn(List.of(artist));
        given(coverFile.getInputStream()).willReturn(InputStream.nullInputStream());
        given(coverFile.getSize()).willReturn(1024L);
        given(coverFile.getContentType()).willReturn("image/jpeg");
        given(coverFile.getOriginalFilename()).willReturn("cover.jpg");
        given(fileStoragePort.upload(any(), anyLong(), anyString(), anyString())).willReturn("cover-key");
        given(albumCoverUrlProviderPort.generateUrl("cover-key")).willReturn("http://url/cover-key");

        UUID albumId = UUID.randomUUID();
        given(albumRepositoryPort.save(any(Album.class))).willAnswer(invocation -> {
            Album album = invocation.getArgument(0);
            album.setId(albumId);
            return album;
        });

        // Act
        AlbumResponse response = createAlbumUseCase.execute(title, artistIds, description, releaseYear, covers);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(albumId);
        assertThat(response.title()).isEqualTo(title);
        assertThat(response.covers()).hasSize(1);
        assertThat(response.covers().get(0).presignedUrl()).isEqualTo("http://url/cover-key");

        verify(fileStoragePort).upload(any(), anyLong(), anyString(), anyString());
        verify(albumRepositoryPort).save(any(Album.class));
    }
}
