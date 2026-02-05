package com.group.music_catalog_manage.infrastructure.adapters.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.group.music_catalog_manage.application.exceptions.ArtistNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.group.music_catalog_manage.application.ports.out.artists.ArtistRepositoryPort;
import com.group.music_catalog_manage.domain.model.Artist;
import com.group.music_catalog_manage.infrastructure.persistence.entity.ArtistEntity;
import com.group.music_catalog_manage.infrastructure.persistence.mapper.ArtistMapper;
import com.group.music_catalog_manage.infrastructure.persistence.repository.JpaArtistRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ArtistRepositoryAdapter implements ArtistRepositoryPort {

    private final JpaArtistRepository jpaRepository;
    private final ArtistMapper artistMapper;
    @Override
    public Artist save(Artist artist) {
        ArtistEntity entity = artistMapper.toEntity(artist);
        ArtistEntity saved = jpaRepository.save(entity);
        return artistMapper.toDomain(saved);
    }

    @Transactional
    @Override
    public Artist update(UUID id, Artist change) {
       ArtistEntity artistEntity = jpaRepository.findById(id)
                .orElseThrow(() -> new ArtistNotFoundException(id.toString()));

        artistEntity.setName(change.getName());
        artistEntity.setBiography(change.getBiography());
        artistEntity.setType(change.getType());
        artistEntity.setFormationYear(change.getFormationYear());

        return artistMapper.toDomain(artistEntity);
    }

    @Override
    public Optional<Artist> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(artistMapper::toDomain);
    }

    @Override
    public List<Artist> findByIds(List<UUID> ids) {
        return jpaRepository.findByIdIn(ids).stream().map(artistMapper::toDomain).toList();
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Page<Artist> findByName(String name, Pageable pageable) {
        if (name == null || name.isBlank()) {
            return jpaRepository.findAll(pageable)
                    .map(artistMapper::toDomain);
        }
        return jpaRepository.findByNameContainingIgnoreCase(name,pageable)
                .map(artistMapper::toDomain);
    }
}

