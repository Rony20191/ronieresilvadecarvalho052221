package com.group.music_catalog_manage.domain.model;

import java.util.UUID;

public class AlbumArtist {

    private UUID id;
    private UUID albumId;
    private UUID artistId;
    private CollaborationRole role;

    public AlbumArtist(Artist artist, CollaborationRole primary) {
    }

    public AlbumArtist(UUID id, UUID albumId, UUID artistId, CollaborationRole role) {
        this.id = id;
        this.albumId = albumId;
        this.artistId = artistId;
        this.role = role;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAlbumId() {
        return albumId;
    }

    public void setAlbumId(UUID albumId) {
        this.albumId = albumId;
    }

    public UUID getArtistId() {
        return artistId;
    }

    public void setArtistId(UUID artistId) {
        this.artistId = artistId;
    }

    public CollaborationRole getRole() {
        return role;
    }

    public void setRole(CollaborationRole role) {
        this.role = role;
    }
}
