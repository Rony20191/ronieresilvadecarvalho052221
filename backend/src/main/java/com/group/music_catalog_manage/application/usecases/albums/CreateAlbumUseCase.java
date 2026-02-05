package com.group.music_catalog_manage.application.usecases.albums;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.group.music_catalog_manage.application.dto.response.AlbumResponse;

public interface CreateAlbumUseCase {
    AlbumResponse execute(
            String title,
            List<UUID> artistId,
            String description,
            Integer releaseYear,
            List<MultipartFile> covers
    );
}
