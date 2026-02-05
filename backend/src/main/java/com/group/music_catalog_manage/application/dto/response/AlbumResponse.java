package com.group.music_catalog_manage.application.dto.response;


import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AlbumResponse(
        UUID id,
        String title,
        String description,
        Integer releaseYear,
        List<AlbumCoverResponse> covers,
        List<ArtistResponse> artists,
        Instant createdAt,
        Instant updatedAt) {
}
