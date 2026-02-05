package com.group.music_catalog_manage.application.ports.out.artists;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.group.music_catalog_manage.domain.model.Artist;

public interface ArtistRepositoryPort {

    Artist save(Artist artist);
    Artist update(UUID id, Artist change);

    Optional<Artist> findById(UUID id);
    List<Artist> findByIds(List<UUID> ids);

    void deleteById(UUID id);

    Page<Artist> findByName(String name, Pageable pageable);

}
