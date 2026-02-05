package com.group.music_catalog_manage.application.usecases.artists;

import com.group.music_catalog_manage.application.dto.request.CreateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.domain.model.Artist;

public interface CreateArtistsUseCase {
    ArtistResponse execute(CreateArtistRequest request);
}
