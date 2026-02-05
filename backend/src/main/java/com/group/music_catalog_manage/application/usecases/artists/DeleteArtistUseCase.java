package com.group.music_catalog_manage.application.usecases.artists;

import java.util.UUID;

public interface DeleteArtistUseCase {
    void execute(UUID id);
}
