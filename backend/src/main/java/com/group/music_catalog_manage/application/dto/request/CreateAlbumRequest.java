package com.group.music_catalog_manage.application.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Schema(name = "CreateAlbumRequest")
public class CreateAlbumRequest {

    @Schema(description = "Album title", example = "Hybrid Theory")
    @NotBlank
    private String title;

    @Schema(description = "Artist ID", example = "1")
    @NotNull
    private Long artistId;

    @Schema(description = "Release year", example = "2000")
    @NotNull
    @Positive
    private Integer releaseYear;

    private String genre;
    private String description;
}

