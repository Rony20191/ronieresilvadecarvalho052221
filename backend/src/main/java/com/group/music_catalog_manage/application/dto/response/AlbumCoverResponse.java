package com.group.music_catalog_manage.application.dto.response;

public record AlbumCoverResponse(
        String fileKey,
        boolean primary,
        String presignedUrl
) {}
