package com.group.music_catalog_manage.infrastructure.persistence.mapper;

import com.group.music_catalog_manage.domain.model.Artist;
import com.group.music_catalog_manage.infrastructure.persistence.entity.ArtistEntity;

import org.springframework.stereotype.Component;

@Component
public class ArtistMapper {
    public Artist toDomain(ArtistEntity entity) {
        if (entity == null)
            return null;

        return new Artist(
                entity.getId(),
                entity.getName(),
                entity.getType(),
                entity.getFormationYear(),
                entity.getBiography(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    public ArtistEntity toEntity(Artist domain) {
        if (domain == null)
            return null;

        ArtistEntity entity = new ArtistEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setType(domain.getType());
        entity.setFormationYear(domain.getFormationYear());
        entity.setBiography(domain.getBiography());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());

        return entity;
    }
}
