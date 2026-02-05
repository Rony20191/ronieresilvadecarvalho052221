package com.group.music_catalog_manage.domain.model;

import java.time.Instant;
import java.util.UUID;

public class AlbumCover {
    private UUID id;
    private String albumId;
    private String fileKey;
    private boolean primary;
    private Instant uploadedAt;
    private Instant createdAt;
    private Instant updatedAt;
    private Album album;

    public AlbumCover(String fileKey, boolean primary) {
        this.fileKey = fileKey;
        this.primary = primary;
    }


    public AlbumCover() {
        this.primary = false;
        this.uploadedAt = Instant.now();
        this.createdAt = Instant.now();
    }

    public AlbumCover(String albumId, String fileKey, boolean primary) {
        this();
        this.albumId = albumId;
        this.fileKey = fileKey;
        this.primary = primary;
    }

    public AlbumCover(UUID id, String albumId, String fileKey, boolean primary,
            Instant uploadedAt, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.albumId = albumId;
        this.fileKey = fileKey;
        this.primary = primary;
        this.uploadedAt = uploadedAt != null ? uploadedAt : Instant.now();
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt;
    }


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getAlbumId() {
        return albumId;
    }

    public void setAlbumId(String albumId) {
        this.albumId = albumId;
    }

    public String getFileKey() {
        return fileKey;
    }

    public void setFileKey(String fileKey) {
        this.fileKey = fileKey;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
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

    public Album getAlbum() {
        return album;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }
}
