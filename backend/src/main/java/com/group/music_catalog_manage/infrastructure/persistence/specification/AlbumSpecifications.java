package com.group.music_catalog_manage.infrastructure.persistence.specification;


import com.group.music_catalog_manage.domain.model.ArtistType;
import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumEntity;
import org.springframework.data.jpa.domain.Specification;

public class AlbumSpecifications {

    public static Specification<AlbumEntity> hasArtistName(String artistName) {
        return (root, query, criteriaBuilder) -> {
            if (artistName == null || artistName.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.join("artist").get("name")),
                    "%" + artistName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<AlbumEntity> hasArtistType(ArtistType artistType) {
        return (root, query, criteriaBuilder) -> {
            if (artistType == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.join("artist").get("type"), artistType);
        };
    }

    public static Specification<AlbumEntity> releasedAfter(Integer year) {
        return (root, query, criteriaBuilder) -> {
            if (year == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("releaseYear"), year);
        };
    }

    public static Specification<AlbumEntity> releasedBefore(Integer year) {
        return (root, query, criteriaBuilder) -> {
            if (year == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("releaseYear"), year);
        };
    }

    public static Specification<AlbumEntity> hasTitle(String title) {
        return (root, query, criteriaBuilder) -> {
            if (title == null || title.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + title.toLowerCase() + "%"
            );
        };
    }


    public static Specification<AlbumEntity> buildSearchSpecification(
            String artistName, ArtistType artistType,
            Integer minYear, Integer maxYear, String title) {

        return Specification.where(hasArtistName(artistName))
                .and(hasArtistType(artistType))
                .and(releasedAfter(minYear))
                .and(releasedBefore(maxYear))
                .and(hasTitle(title));
    }
}
