package com.group.music_catalog_manage.application.dto.request;

import com.group.music_catalog_manage.domain.model.ArtistType;
import lombok.Data;

@Data
public class UpdateArtistRequest {
    private String name;
    private ArtistType type;
    private Integer formationYear;
    private String biography;
}
