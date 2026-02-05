package com.group.music_catalog_manage.application.usecases.artists;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;

import java.util.UUID;

public interface FindArtistsByIdUseCase {
 ArtistResponse execute(UUID id);
}
