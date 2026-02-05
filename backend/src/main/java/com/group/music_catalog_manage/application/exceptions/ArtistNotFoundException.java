package com.group.music_catalog_manage.application.exceptions;

public class ArtistNotFoundException extends RuntimeException {
    public ArtistNotFoundException() {
        super("Artista não encontrado");
    }

    public ArtistNotFoundException(String message) {
        super(message);
    }
}
