package com.group.music_catalog_manage.application.dto.request;

import com.group.music_catalog_manage.domain.model.ArtistType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateArtistRequest {
    @NotBlank
    private String name;

    private ArtistType type;

    private Integer formationYear;

    private String biography;
}
