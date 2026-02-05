package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.request.UpdateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.mapper.ArtistMapper;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.usecases.artists.UpdateArtistsUseCase;
import com.group.music_catalog_manage.domain.model.Artist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateArtistsUseCaseImpl implements UpdateArtistsUseCase {

    private final ArtistRepositoryPort artistRepositoryPort;

    public ArtistResponse execute(UUID id, UpdateArtistRequest request) {

        Artist artistDomain = new Artist();
        artistDomain.setName(request.getName());
        artistDomain.setType(request.getType());
        artistDomain.setFormationYear(request.getFormationYear());
        artistDomain.setBiography(request.getBiography());
        return ArtistMapper.toResponse(artistRepositoryPort.update(id, artistDomain));
    }
}
