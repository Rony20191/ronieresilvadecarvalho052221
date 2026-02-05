package com.group.music_catalog_manage.infrastructure.persistence.repository;

import com.group.music_catalog_manage.infrastructure.persistence.entity.AlbumEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class JpaAlbumRepositoryTest {

    @Autowired
    private JpaAlbumRepository albumRepository;

    @Test
    @DisplayName("Should find albums by title containing ignore case")
    void shouldFindByTitleContainingIgnoreCase() {
        // Arrange
        AlbumEntity album = AlbumEntity.builder()
                .title("The Number of the Beast")
                .releaseYear(1982)
                .build();
        albumRepository.save(album);

        // Act
        Page<AlbumEntity> result = albumRepository.findByTitleContainingIgnoreCase("beast", PageRequest.of(0, 10));

        // Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("The Number of the Beast");
    }

    @Test
    @DisplayName("Should find albums with artists and covers")
    void shouldFindAlbumsWithArtistsAndCovers() {
        // Arrange
        AlbumEntity album = AlbumEntity.builder()
                .title("Album with Extras")
                .releaseYear(2023)
                .build();
        album = albumRepository.save(album);

        // Act
        List<AlbumEntity> result = albumRepository.findAlbumsWithArtistsAndCovers(List.of(album.getId()));

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Album with Extras");
    }
}
