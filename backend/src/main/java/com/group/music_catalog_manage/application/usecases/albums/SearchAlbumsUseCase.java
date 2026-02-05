package com.group.music_catalog_manage.application.usecases.albums;


import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.group.music_catalog_manage.application.dto.request.SearchAlbumRequest;

public interface SearchAlbumsUseCase {
    Page<AlbumResponse> execute(
            SearchAlbumRequest request,
            Pageable pageable);
}
