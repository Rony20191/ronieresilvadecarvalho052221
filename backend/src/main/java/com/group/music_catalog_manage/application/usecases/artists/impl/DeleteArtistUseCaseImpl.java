package com.group.music_catalog_manage.application.usecases.artists.impl;

import com.group.music_catalog_manage.application.exceptions.ArtistNotFoundException;
import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.application.usecases.artists.DeleteArtistUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteArtistUseCaseImpl implements DeleteArtistUseCase {

    private final ArtistRepositoryPort artistRepositoryPort;

    public void execute(UUID artistId) {
        artistRepositoryPort.findById(artistId)
                .orElseThrow(() -> new ArtistNotFoundException("Artist not found with id: " + artistId));
        artistRepositoryPort.deleteById(artistId);
    }


}
