package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.usecases.albums.DeleteAlbumUseCase;
import com.group.music_catalog_manage.domain.model.Album;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteAlbumUseCaseImpl implements DeleteAlbumUseCase {
    private final AlbumRepositoryPort albumRepositoryPort;
    private final AlbumCoverUrlProviderPort albumCoverUrlProviderPort;
    public void execute(String id) {
        Album album = albumRepositoryPort.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));
        albumRepositoryPort.deleteById(UUID.fromString(id));
    }
}
