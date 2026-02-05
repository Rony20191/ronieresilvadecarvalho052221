package com.group.music_catalog_manage.application.usecases.albums;

import com.group.music_catalog_manage.application.dto.request.UpdateAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

public interface UpdateAlbumUseCase {
    AlbumResponse execute(UUID id, String title, List<UUID> artistIds, String description, Integer releaseYear,
            List<MultipartFile> covers);
}
