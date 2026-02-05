package com.group.music_catalog_manage.application.usecases.albums;

import com.group.music_catalog_manage.application.dto.response.AlbumResponse;

public interface GetAlbumByIdUseCase {
    AlbumResponse execute(String id);
}
