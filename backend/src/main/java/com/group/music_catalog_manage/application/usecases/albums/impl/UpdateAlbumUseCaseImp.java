package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.request.UpdateAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.mapper.AlbumMapper;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.usecases.albums.UpdateAlbumUseCase;
import com.group.music_catalog_manage.domain.model.Album;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import com.group.music_catalog_manage.application.exceptions.AlbumNotFoundException;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.ports.out.storage.FileStoragePort;
import com.group.music_catalog_manage.domain.model.AlbumCover;
import com.group.music_catalog_manage.domain.model.Artist;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateAlbumUseCaseImp implements UpdateAlbumUseCase {
    private final AlbumRepositoryPort albumRepositoryPort;
    private final AlbumCoverUrlProviderPort albumCoverUrlProviderPort;
    private final ArtistRepositoryPort artistRepositoryPort;
    private final FileStoragePort fileStoragePort;

    public AlbumResponse execute(UUID id, String title, List<UUID> artistIds, String description, Integer releaseYear,
            List<MultipartFile> covers) {
        Album album = albumRepositoryPort.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id.toString()));

        album.setTitle(title);
        album.setDescription(description);
        album.setReleaseYear(releaseYear);

        List<Artist> artists = artistRepositoryPort.findByIds(artistIds);
        album.setArtists(artists);

        if (covers != null && !covers.isEmpty()) {
            for (int i = 0; i < covers.size(); i++) {
                MultipartFile file = covers.get(i);
                boolean isMain = false; // Add new covers as secondary by default

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

        return AlbumMapper.toResponse(albumRepositoryPort.save(album), albumCoverUrlProviderPort);
    }
}
