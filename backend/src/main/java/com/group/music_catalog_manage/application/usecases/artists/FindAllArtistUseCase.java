package com.group.music_catalog_manage.application.usecases.artists;

import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FindAllArtistUseCase {
     Page<ArtistResponse> execute(String name, Pageable pageable);
}
