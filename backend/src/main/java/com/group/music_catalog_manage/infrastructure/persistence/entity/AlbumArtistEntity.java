package com.group.music_catalog_manage.infrastructure.persistence.entity;

import com.group.music_catalog_manage.domain.model.CollaborationRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "album_artists",
        uniqueConstraints = @UniqueConstraint(columnNames = {"album_id", "artist_id", "role"}))
public class AlbumArtistEntity {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false, foreignKey = @ForeignKey(name = "fk_album_artists_album"))
    private AlbumEntity album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false, foreignKey = @ForeignKey(name = "fk_album_artists_artist"))
    private ArtistEntity artist;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private CollaborationRole role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
