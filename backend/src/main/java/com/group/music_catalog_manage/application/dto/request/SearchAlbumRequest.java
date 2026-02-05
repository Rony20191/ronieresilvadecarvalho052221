package com.group.music_catalog_manage.application.dto.request;

import jakarta.validation.constraints.*;
import com.group.music_catalog_manage.domain.model.ArtistType;
import com.group.music_catalog_manage.domain.model.CollaborationRole;
import org.springframework.web.bind.annotation.RequestParam;


public record SearchAlbumRequest(

        @Size(max = 255)
        String albumTitle,

        @Size(max = 255) String artistName,

        ArtistType artistType,

        CollaborationRole artistRole,

        @Min(1000) @Max(5000) Integer minReleaseYear,

        @Min(1000) @Max(5000) Integer maxReleaseYear) {
}