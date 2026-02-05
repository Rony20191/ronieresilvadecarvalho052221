package com.group.music_catalog_manage.infrastructure.persistence.mapper;

import com.group.music_catalog_manage.domain.model.Album;
import com.group.music_catalog_manage.domain.model.AlbumArtist;
import com.group.music_catalog_manage.domain.model.AlbumCover;
import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumArtistEntity;
import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumCoverEntity;
import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumEntity;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class AlbumMapper {

    public Album toDomain(AlbumEntity entity) {
        if (entity == null)
            return null;

        Album album = new Album(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getReleaseYear(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());

        if (entity.getCovers() != null) {
            album.setCovers(entity.getCovers().stream()
                    .map(cover -> toDomainCover(cover))
                    .collect(Collectors.toList()));
        }

        if (entity.getAlbumArtists() != null) {
            album.setAlbumArtists(entity.getAlbumArtists().stream()
                    .map(albumArtist -> toDomainAlbumArtist(albumArtist))
                    .collect(Collectors.toList()));
        }

        return album;
    }

    public AlbumEntity toEntity(Album domain) {
        if (domain == null)
            return null;

        AlbumEntity entity = new AlbumEntity();
        entity.setId(domain.getId());
        entity.setTitle(domain.getTitle());
        entity.setDescription(domain.getDescription());
        entity.setReleaseYear(domain.getReleaseYear());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());

        if (domain.getCovers() != null) {
            entity.setCovers(domain.getCovers().stream()
                    .map(cover -> toEntityCover(cover, entity))
                    .collect(Collectors.toSet()));
        }

        if (domain.getArtists() != null && !domain.getArtists().isEmpty()) {
            entity.setAlbumArtists(domain.getArtists().stream()
                    .map(artist -> {
                        com.group.music_catalog_manage.infrastructure.persistence.entity.ArtistEntity artistEntity = new com.group.music_catalog_manage.infrastructure.persistence.entity.ArtistEntity();
                        artistEntity.setId(artist.getId());

                        return com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumArtistEntity
                                .builder()
                                .album(entity)
                                .artist(artistEntity)
                                .role(com.group.music_catalog_manage.domain.model.CollaborationRole.PRIMARY)
                                .build();
                    })
                    .collect(Collectors.toSet()));
        }

        return entity;
    }

    private AlbumCover toDomainCover(AlbumCoverEntity entity) {
        return new AlbumCover(
                entity.getId(),
                entity.getAlbum().getId().toString(),
                entity.getFileKey(),
                entity.getPrimary(),
                entity.getUploadedAt(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    private AlbumCoverEntity toEntityCover(AlbumCover domain, AlbumEntity albumEntity) {
        AlbumCoverEntity entity = new AlbumCoverEntity();
        entity.setId(domain.getId());
        entity.setFileKey(domain.getFileKey());
        entity.setPrimary(domain.isPrimary());
        entity.setAlbum(albumEntity);
        entity.setUploadedAt(domain.getUploadedAt());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    private AlbumArtist toDomainAlbumArtist(AlbumArtistEntity entity) {
        return new AlbumArtist(
                entity.getId(),
                entity.getAlbum().getId(),
                entity.getArtist().getId(),
                entity.getRole());
    }
}
