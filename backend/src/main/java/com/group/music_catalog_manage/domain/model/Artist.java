package com.group.music_catalog_manage.domain.model;

import java.time.Instant;
import java.util.UUID;

public class Artist {
    private UUID id;
    private String name;
    private ArtistType type;
    private Integer formationYear;
    private String biography;
    private Instant createdAt;
    private Instant updatedAt;

    public Artist() {
        this.createdAt = Instant.now();
        this.type = ArtistType.SOLO;
    }

    public Artist(String name, ArtistType type, Integer formationYear, String biography) {
        this();
        this.name = name;
        this.type = type;
        this.formationYear = formationYear;
        this.biography = biography;
    }

    public Artist(UUID id, String name, ArtistType type, Integer formationYear,
            String biography, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.type = type != null ? type : ArtistType.SOLO;
        this.formationYear = formationYear;
        this.biography = biography;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArtistType getType() {
        return type;
    }

    public void setType(ArtistType type) {
        this.type = type;
    }

    public Integer getFormationYear() {
        return formationYear;
    }

    public void setFormationYear(Integer formationYear) {
        this.formationYear = formationYear;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void updateTimestamp() {
        this.updatedAt = Instant.now();
    }
}
