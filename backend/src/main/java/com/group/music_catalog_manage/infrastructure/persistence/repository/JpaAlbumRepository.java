package com.group.music_catalog_manage.infrastructure.persistence.repository;

import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaAlbumRepository extends JpaRepository<AlbumEntity, UUID> {
    Page<AlbumEntity> findByTitleContainingIgnoreCase(String title,
                                                      Pageable pageable);


    @Query("""
        select distinct a
        from AlbumEntity a
        left join fetch a.albumArtists aa
        left join fetch aa.artist ar
        left join fetch a.covers c
        where a.id in :albumIds
    """)
    List<AlbumEntity> findAlbumsWithArtistsAndCovers(@Param("albumIds") List<UUID> albumIds);
}
