package com.group.music_catalog_manage.infrastructure.persistence.repository;

import com.group.music_catalog_manage.domain.model.ArtistType;
import com.group.music_catalog_manage.infrastructure.persistence.entity.ArtistEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class JpaArtistRepositoryTest {

    @Autowired
    private JpaArtistRepository artistRepository;

    @Test
    @DisplayName("Should find artists by name containing ignore case")
    void shouldFindByNameContainingIgnoreCase() {
        ArtistEntity artist = ArtistEntity.builder()
                .name("Iron Maiden")
                .type(ArtistType.BAND)
                .build();
        artistRepository.save(artist);

        Page<ArtistEntity> result = artistRepository.findByNameContainingIgnoreCase("iron", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Iron Maiden");
    }

    @Test
    @DisplayName("Should find artists by ids")
    void shouldFindByIdIn() {
        ArtistEntity artist1 = ArtistEntity.builder()
                .name("Artist 1")
                .type(ArtistType.SOLO)
                .build();
        ArtistEntity artist2 = ArtistEntity.builder()
                .name("Artist 2")
                .type(ArtistType.SOLO)
                .build();

        artist1 = artistRepository.save(artist1);
        artist2 = artistRepository.save(artist2);

        List<ArtistEntity> result = artistRepository.findByIdIn(List.of(artist1.getId(), artist2.getId()));

        assertThat(result).hasSize(2);
        assertThat(result).extracting(ArtistEntity::getName).containsExactlyInAnyOrder("Artist 1", "Artist 2");
    }
}