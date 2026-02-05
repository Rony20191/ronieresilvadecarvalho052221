package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;

import com.group.music_catalog_manage.application.mapper.ArtistMapper;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.usecases.artists.FindAllArtistUseCase;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindAllArtistUseCaseImpl implements FindAllArtistUseCase {

    private final ArtistRepositoryPort artistRepositoryPort;

    public Page<ArtistResponse> execute(String name, Pageable pageable) {

        return artistRepositoryPort.findByName(name, pageable).map(ArtistMapper::toResponse);
    }
}
