package com.group.music_catalog_manage.application.controller.v1;

import com.group.music_catalog_manage.application.dto.request.SearchAlbumRequest;
import com.group.music_catalog_manage.application.dto.request.UpdateAlbumRequest;
import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.usecases.albums.*;
import com.group.music_catalog_manage.infrastructure.config.websocket.WebSocketService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/albums")
@Tag(name = "Albums Controller", description = "Album Management")
@RequiredArgsConstructor
public class AlbumController {

    private final CreateAlbumUseCase createAlbumUseCase;
    private final UpdateAlbumUseCase updateAlbumUseCase;
    private final DeleteAlbumUseCase deleteAlbumUseCase;
    private final GetAlbumByIdUseCase getAlbumByIdUseCase;
    private final SearchAlbumsUseCase searchAlbumsUseCase;
    private final WebSocketService webSocketService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @CacheEvict(value = { "albums", "album-id" }, allEntries = true)
    public ResponseEntity<AlbumResponse> createAlbum(
            @RequestParam("title") String title,
            @RequestParam("artistIds") List<UUID> artistIds,
            @RequestParam("releaseYear") Integer releaseYear,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "cover", required = false) List<MultipartFile> covers) {

        AlbumResponse createdAlbum = createAlbumUseCase.execute(title, artistIds, description, releaseYear, covers);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdAlbum.id())
                .toUri();

        // Notify all clients about the new album
        webSocketService.notifyAlbumCreated(createdAlbum);

        return ResponseEntity.created(location).body(createdAlbum);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @CacheEvict(value = { "albums", "album-id" }, allEntries = true)
    public ResponseEntity<AlbumResponse> updateAlbum(
            @PathVariable UUID id,
            @RequestParam("title") String title,
            @RequestParam("artistIds") List<UUID> artistIds,
            @RequestParam("releaseYear") Integer releaseYear,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "cover", required = false) List<MultipartFile> covers) {

        AlbumResponse updatedAlbum = updateAlbumUseCase.execute(id, title, artistIds, description, releaseYear, covers);

        // Notify all clients about the album update
        webSocketService.notifyAlbumUpdated(updatedAlbum);

        return ResponseEntity.ok(updatedAlbum);
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = { "albums", "album-id" }, allEntries = true)
    public ResponseEntity<Void> deleteAlbum(@PathVariable String id) {
        deleteAlbumUseCase.execute(id);

        // Notify all clients about the album deletion
        webSocketService.notifyAlbumDeleted(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlbumResponse> getAlbumById(@PathVariable String id) {
        return ResponseEntity.ok(getAlbumByIdUseCase.execute(id));
    }

    @GetMapping
    public ResponseEntity<Page<AlbumResponse>> searchAlbums(
            @ParameterObject @ModelAttribute SearchAlbumRequest request,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(searchAlbumsUseCase.execute(request, pageable));
    }
}
