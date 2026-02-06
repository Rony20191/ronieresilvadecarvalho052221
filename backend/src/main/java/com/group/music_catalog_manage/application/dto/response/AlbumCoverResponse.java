package com.group.music_catalog_manage.application.dto.response;

import java.util.UUID;

public record AlbumCoverResponse(
                UUID id,
                String fileKey,
                boolean primary,
                String presignedUrl) {
}
