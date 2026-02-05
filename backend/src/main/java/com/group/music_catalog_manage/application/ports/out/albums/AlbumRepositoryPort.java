package com.group.music_catalog_manage.application.ports.out.albums;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.group.music_catalog_manage.domain.model.Album;

public interface AlbumRepositoryPort {
    Album save(Album album);

    Optional<Album> findById(UUID id);


    void deleteById(UUID id);

    Page<Album> findByTitle(String title, Pageable pageable);

    Album update(UUID id, Album changes);
}
