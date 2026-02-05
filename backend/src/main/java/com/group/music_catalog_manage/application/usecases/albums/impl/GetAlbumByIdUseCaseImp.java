package com.group.music_catalog_manage.application.usecases.albums.impl;

import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.exceptions.AlbumNotFoundException;
import com.group.music_catalog_manage.application.mapper.AlbumMapper;

import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.application.usecases.albums.GetAlbumByIdUseCase;
import com.group.music_catalog_manage.domain.model.Album;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetAlbumByIdUseCaseImp implements GetAlbumByIdUseCase {
    private final AlbumCoverUrlProviderPort albumCoverUrlProviderPort;
    private final AlbumRepositoryPort albumRepositoryPort;


    public AlbumResponse execute(String id) {

        Album album = albumRepositoryPort.findById(UUID.fromString(id))
                .orElseThrow(() -> new AlbumNotFoundException("Album not found with id: " + id));
        return AlbumMapper.toResponse(album, albumCoverUrlProviderPort);
    }
}
