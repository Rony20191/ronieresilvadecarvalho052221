package com.group.music_catalog_manage.infrastructure.adapters.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.group.music_catalog_manage.application.exceptions.AlbumNotFoundException;
import com.group.music_catalog_manage.domain.model.Artist;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.group.music_catalog_manage.application.ports.out.albums.AlbumRepositoryPort;
import com.group.music_catalog_manage.domain.model.Album;
import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumEntity;
import com.group.music_catalog_manage.infrastructure.persistence.mapper.AlbumMapper;
import com.group.music_catalog_manage.infrastructure.persistence.repository.JpaAlbumRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AlbumRepositoryAdapter implements AlbumRepositoryPort {
    private final JpaAlbumRepository jpaRepository;
    private final AlbumMapper albumMapper;

    @Override
    public Album save(Album album) {
        AlbumEntity entity = albumMapper.toEntity(album);
        AlbumEntity saved = jpaRepository.saveAndFlush(entity);
        return albumMapper.toDomain(saved);
    }

    @Override
    public Optional<Album> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(albumMapper::toDomain);
    }



    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Page<Album> findByTitle(String title, Pageable pageable) {
        if (title == null || title.isBlank()) {
            return jpaRepository.findAll(pageable)
                    .map(albumMapper::toDomain);
        }
        return jpaRepository
                .findByTitleContainingIgnoreCase(title, pageable)
                .map(albumMapper::toDomain);
    }

    @Override
    @Transactional
    public Album update(UUID id, Album changes) {


        AlbumEntity entity = jpaRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id.toString()));

        entity.setTitle(changes.getTitle());
        entity.setDescription(changes.getDescription());
        entity.setReleaseYear(changes.getReleaseYear());


        return albumMapper.toDomain(entity);
    }
}
