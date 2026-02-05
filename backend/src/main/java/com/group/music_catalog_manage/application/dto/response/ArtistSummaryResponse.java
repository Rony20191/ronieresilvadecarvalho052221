package com.group.music_catalog_manage.application.dto.response;

import com.group.music_catalog_manage.domain.model.ArtistType;
import com.group.music_catalog_manage.domain.model.CollaborationRole;

import java.util.UUID;

public record ArtistSummaryResponse(
        UUID id,
        String name,
        ArtistType type,
        Integer formationYear,
        String biography
) {}
