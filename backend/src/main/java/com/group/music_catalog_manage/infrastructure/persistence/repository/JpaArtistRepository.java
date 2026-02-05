package com.group.music_catalog_manage.infrastructure.persistence.repository;

import com.group.music_catalog_manage.domain.model.Artist;
import com.group.music_catalog_manage.infrastructure.persistence.entity.ArtistEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaArtistRepository extends JpaRepository<ArtistEntity, UUID>, JpaSpecificationExecutor<ArtistEntity> {
    Page<ArtistEntity> findAll(Pageable pageable);

    Page<ArtistEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT a FROM ArtistEntity a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY a.name ASC")
    List<ArtistEntity> findByNameOrderedAsc(@Param("name") String name);

    @Query("SELECT a FROM ArtistEntity a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY a.name DESC")
    List<ArtistEntity> findByNameOrderedDesc(@Param("name") String name);

    List<ArtistEntity> findByIdIn(List<UUID> ids);

}
