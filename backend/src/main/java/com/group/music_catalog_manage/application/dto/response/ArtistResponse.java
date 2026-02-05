package com.group.music_catalog_manage.application.dto.response;

import com.group.music_catalog_manage.domain.model.ArtistType;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ArtistResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    private UUID id;
    private String name;
    private ArtistType type;
    private Integer formationYear;
    private String biography;
    private Instant createdAt;
    private Instant updatedAt;
}
