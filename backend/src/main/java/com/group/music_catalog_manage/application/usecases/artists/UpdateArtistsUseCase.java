package com.group.music_catalog_manage.application.usecases.artists;

import com.group.music_catalog_manage.application.dto.request.UpdateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;

import java.util.UUID;

public interface UpdateArtistsUseCase {
     ArtistResponse execute(UUID id, UpdateArtistRequest request);
}
