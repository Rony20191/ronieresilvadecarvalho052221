package com.group.music_catalog_manage.application.controller.v1;

import com.group.music_catalog_manage.application.dto.response.AlbumResponse;
import com.group.music_catalog_manage.application.usecases.albums.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import com.group.music_catalog_manage.application.dto.request.UpdateAlbumRequest;
import com.group.music_catalog_manage.application.dto.request.SearchAlbumRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AlbumController.class)
@AutoConfigureMockMvc(addFilters = false)
class AlbumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CreateAlbumUseCase createAlbumUseCase;
    @MockitoBean
    private UpdateAlbumUseCase updateAlbumUseCase;
    @MockitoBean
    private DeleteAlbumUseCase deleteAlbumUseCase;
    @MockitoBean
    private GetAlbumByIdUseCase getAlbumByIdUseCase;
    @MockitoBean
    private SearchAlbumsUseCase searchAlbumsUseCase;

    @Test
    @DisplayName("Should create album successfully")
    void shouldCreateAlbumSuccessfully() throws Exception {
        // Arrange
        UUID albumId = UUID.randomUUID();
        String title = "New Album";
        UUID artistId = UUID.randomUUID();

        AlbumResponse response = new AlbumResponse(
                albumId,
                title,
                "Description",
                2023,
                List.of(),
                List.of(),
                null,
                null);

        given(createAlbumUseCase.execute(
                eq(title),
                any(),
                eq("Description"),
                eq(2023),
                any())).willReturn(response);

        MockMultipartFile coverPart = new MockMultipartFile(
                "cover",
                "cover.jpg",
                "image/jpeg",
                "content".getBytes());

        // Act & Assert
        mockMvc.perform(multipart("/v1/albums")
                .file(coverPart)
                .param("title", title)
                .param("artistIds", artistId.toString())
                .param("releaseYear", "2023")
                .param("description", "Description")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(albumId.toString()))
                .andExpect(jsonPath("$.title").value(title));
    }

    @Test
    @DisplayName("Should update album successfully")
    void shouldUpdateAlbumSuccessfully() throws Exception {
        UUID albumId = UUID.randomUUID();
        String title = "Updated Title";
        UUID artistId = UUID.randomUUID();

        AlbumResponse response = new AlbumResponse(albumId, title, null, 2024, List.of(), List.of(), null,
                null);

        given(updateAlbumUseCase.execute(
                eq(albumId),
                eq(title),
                any(),
                any(),
                eq(2024),
                any()))
                .willReturn(response);

        MockMultipartFile coverPart = new MockMultipartFile(
                "cover",
                "cover.jpg",
                "image/jpeg",
                "content".getBytes());

        mockMvc.perform(multipart("/v1/albums/{id}", albumId)
                .file(coverPart)
                .param("title", title)
                .param("artistIds", artistId.toString())
                .param("releaseYear", "2024")
                .param("description", "Updated Description")
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(title));
    }

    @Test
    @DisplayName("Should delete album successfully")
    void shouldDeleteAlbumSuccessfully() throws Exception {
        UUID albumId = UUID.randomUUID();

        doNothing().when(deleteAlbumUseCase).execute(albumId.toString());

        mockMvc.perform(delete("/v1/albums/{id}", albumId))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should get album by id successfully")
    void shouldGetAlbumByIdSuccessfully() throws Exception {
        UUID albumId = UUID.randomUUID();
        AlbumResponse response = new AlbumResponse(albumId, "Album Title", null, 2023, List.of(), List.of(), null,
                null);

        given(getAlbumByIdUseCase.execute(albumId.toString())).willReturn(response);

        mockMvc.perform(get("/v1/albums/{id}", albumId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(albumId.toString()));
    }

    @Test
    @DisplayName("Should search albums successfully")
    void shouldSearchAlbumsSuccessfully() throws Exception {
        AlbumResponse response = new AlbumResponse(UUID.randomUUID(), "Album Title", null, 2023, List.of(), List.of(),
                null, null);
        PageImpl<AlbumResponse> page = new PageImpl<>(List.of(response));

        given(searchAlbumsUseCase.execute(any(SearchAlbumRequest.class), any(PageRequest.class))).willReturn(page);

        mockMvc.perform(get("/v1/albums")
                .param("albumTitle", "Album")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Album Title"));
    }
}
