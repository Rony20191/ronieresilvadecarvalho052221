package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.exceptions.ArtistNotFoundException;
import com.group.music_catalog_manage.application.mapper.ArtistMapper;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.usecases.artists.FindArtistsByIdUseCase;
import com.group.music_catalog_manage.domain.model.Artist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FindByIdUseCaseImpl implements FindArtistsByIdUseCase {

    private final ArtistRepositoryPort artistRepositoryPort;

    public ArtistResponse execute(UUID id) {
      Artist artist = artistRepositoryPort.findById(id)
                .orElseThrow(() -> new ArtistNotFoundException("Artist not found with id: " + id));
        return ArtistMapper.toResponse(artist);
    }
}
