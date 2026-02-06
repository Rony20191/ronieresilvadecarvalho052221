package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.request.CreateAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.mapper.AlbumMapper;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.storage.FileStoragePort;
import com.group.music_catalog_manage.application.usecases.albums.CreateAlbumUseCase;
import com.group.music_catalog_manage.domain.model.Album;
import com.group.music_catalog_manage.domain.model.AlbumCover;
import com.group.music_catalog_manage.domain.model.Artist;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateAlbumUseCaseImpl implements CreateAlbumUseCase {
    private final AlbumRepositoryPort albumRepositoryPort;
    private final AlbumCoverUrlProviderPort albumCoverUrlProviderPort;
    private final FileStoragePort fileStoragePort;
    private final ArtistRepositoryPort artistRepositoryPort;
    private final com.group.music_catalog_manage.infrastructure.config.websocket.WebSocketService webSocketService;

    @Transactional
    public AlbumResponse execute(
            String title,
            List<UUID> artistIds,
            String description,
            Integer releaseYear,
            List<MultipartFile> covers) {

        Album album = new Album();
        album.setTitle(title);
        album.setDescription(description);
        album.setReleaseYear(releaseYear);

        List<Artist> artists = artistRepositoryPort.findByIds(artistIds);

        if (covers != null && !covers.isEmpty()) {
            for (int i = 0; i < covers.size(); i++) {
                MultipartFile file = covers.get(i);

                boolean isMain = (i == 0);

                try {
                    String fileKey = fileStoragePort.upload(
                            file.getInputStream(),
                            file.getSize(),
                            file.getContentType(),
                            file.getOriginalFilename());

                    AlbumCover cover = new AlbumCover(fileKey, isMain);
                    album.addCover(cover);

                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                }
            }
        }
        album.setArtists(artists);
        albumRepositoryPort.save(album);

        AlbumResponse response = AlbumMapper.toResponse(album, albumCoverUrlProviderPort);
        webSocketService.notifyAlbumCreated(response);
        return response;
    }

}
