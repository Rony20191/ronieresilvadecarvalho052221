package com.group.music_catalog_manage.application.controller.v1;

import com.group.music_catalog_manage.application.dto.request.CreateArtistRequest;
import com.group.music_catalog_manage.application.dto.request.UpdateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.usecases.artists.*;
import com.group.music_catalog_manage.infrastructure.config.websocket.WebSocketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/v1/artists")
@Tag(name = "Artist Controller", description = "Gerenciamento de Artistas")
@RequiredArgsConstructor
public class ArtistController {

    private final CreateArtistsUseCase createArtistsUseCase;
    private final FindAllArtistUseCase findAllArtistUseCase;
    private final FindArtistsByIdUseCase findByIdUseCase;
    private final UpdateArtistsUseCase updateArtistsUseCase;
    private final DeleteArtistUseCase deleteArtistUseCase;
    private final WebSocketService webSocketService;

    @GetMapping
    @Operation(summary = "Listar todos os artistas")
    public ResponseEntity<Page<ArtistResponse>> findAll(
            @RequestParam(required = false) String name,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(findAllArtistUseCase.execute(name, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar artista por ID")
    public ResponseEntity<ArtistResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(findByIdUseCase.execute(id));
    }

    @PostMapping
    @Operation(summary = "Criar novo artista")
    @CacheEvict(value = { "artists", "artist-id" }, allEntries = true)
    public ResponseEntity<ArtistResponse> save(@RequestBody CreateArtistRequest request) {

        ArtistResponse response = createArtistsUseCase.execute(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        // Notify all clients about the new artist
        webSocketService.notifyArtistCreated(response);

        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar artista")
    @Caching(evict = {
            @CacheEvict(value = "artists", allEntries = true),
            @CacheEvict(value = "artist-id", key = "#id"),
            @CacheEvict(value = "albums", allEntries = true),
            @CacheEvict(value = "album-id", allEntries = true)
    })
    public ResponseEntity<ArtistResponse> update(
            @PathVariable UUID id,
            @RequestBody UpdateArtistRequest request) {

        ArtistResponse updatedArtist = updateArtistsUseCase.execute(id, request);

        // Notify all clients about the artist update
        webSocketService.notifyArtistUpdated(updatedArtist);

        return ResponseEntity.ok(updatedArtist);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar artista")
    @Caching(evict = {
            @CacheEvict(value = "artists", allEntries = true),
            @CacheEvict(value = "artist-id", key = "#id"),
            @CacheEvict(value = "albums", allEntries = true),
            @CacheEvict(value = "album-id", allEntries = true)
    })
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deleteArtistUseCase.execute(id);

        // Notify all clients about the artist deletion
        webSocketService.notifyArtistDeleted(id.toString());

        return ResponseEntity.noContent().build();
    }
}
