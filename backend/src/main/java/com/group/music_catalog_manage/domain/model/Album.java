package com.group.music_catalog_manage.domain.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Album {
    private UUID id;
    private String title;
    private String description;
    private Integer releaseYear;
    private Instant createdAt;
    private Instant updatedAt;
    private List<AlbumCover> covers = new ArrayList<>();
    private List<Artist> artists = new ArrayList<>();
    private List<AlbumArtist> albumArtists = new ArrayList<>();


    public Album() {
        this.createdAt = Instant.now();
        covers = new ArrayList<>();
    }

    public Album(String title, Integer releaseYear) {
        this();
        this.title = title;
        this.releaseYear = releaseYear;
    }

    public Album(UUID id, String title, String description, Integer releaseYear, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.releaseYear = releaseYear;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void addCover(AlbumCover cover) {
        this.covers.add(cover);
        cover.setAlbum(this);
    }

    public List<AlbumArtist> getAlbumArtists() {
        return albumArtists;
    }

    public void setAlbumArtists(List<AlbumArtist> albumArtists) {
        this.albumArtists = albumArtists;
    }

    public List<Artist> getArtists() {
        return artists;
    }

    public void setArtists(List<Artist> artists) {
        this.artists = artists;
    }

    public List<AlbumCover> getCovers() {
        return covers;
    }

    public void setCovers(List<AlbumCover> covers) {
        this.covers = covers;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
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
}
