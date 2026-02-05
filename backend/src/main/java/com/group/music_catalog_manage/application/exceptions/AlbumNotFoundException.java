package com.group.music_catalog_manage.application.exceptions;

public class AlbumNotFoundException extends RuntimeException {
    public AlbumNotFoundException() {
        super("Album não encontrado");
    }

    public AlbumNotFoundException(String message) {
        super(message);
    }
}
