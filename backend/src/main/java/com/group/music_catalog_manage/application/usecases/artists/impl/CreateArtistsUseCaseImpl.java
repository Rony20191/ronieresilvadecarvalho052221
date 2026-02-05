package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.request.CreateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.mapper.ArtistMapper;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.usecases.artists.CreateArtistsUseCase;
import com.group.music_catalog_manage.domain.model.Artist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateArtistsUseCaseImpl implements CreateArtistsUseCase {

    private final ArtistRepositoryPort artistRepositoryPort;

    public ArtistResponse execute(CreateArtistRequest request) {
        Artist artistDomain = new Artist(
                request.getName(),
                request.getType(),
                request.getFormationYear(),
                request.getBiography());

        return ArtistMapper.toResponse(artistRepositoryPort.save(artistDomain));
    }
}
