package com.group.music_catalog_manage.application.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.music_catalog_manage.application.dto.request.CreateArtistRequest;
import com.group.music_catalog_manage.application.dto.request.UpdateArtistRequest;
import com.group.music_catalog_manage.application.dto.response.ArtistResponse;
import com.group.music_catalog_manage.application.usecases.artists.*;
import com.group.music_catalog_manage.domain.model.ArtistType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ArtistController.class)
@AutoConfigureMockMvc(addFilters = false)
class ArtistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CreateArtistsUseCase createArtistsUseCase;
    @MockitoBean
    private FindAllArtistUseCase findAllArtistUseCase;
    @MockitoBean
    private FindArtistsByIdUseCase findByIdUseCase;
    @MockitoBean
    private UpdateArtistsUseCase updateArtistsUseCase;
    @MockitoBean
    private DeleteArtistUseCase deleteArtistUseCase;

    @Test
    @DisplayName("Should create artist successfully")
    void shouldCreateArtistSuccessfully() throws Exception {
        CreateArtistRequest request = new CreateArtistRequest();
        request.setName("New Artist");
        request.setType(ArtistType.SOLO);

        ArtistResponse response = ArtistResponse.builder()
                .id(UUID.randomUUID())
                .name("New Artist")
                .type(ArtistType.SOLO)
                .build();

        given(createArtistsUseCase.execute(any(CreateArtistRequest.class))).willReturn(response);

        mockMvc.perform(post("/v1/artists")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Artist"));
    }

    @Test
    @DisplayName("Should find all artists successfully")
    void shouldFindAllArtistsSuccessfully() throws Exception {
        ArtistResponse response = ArtistResponse.builder()
                .id(UUID.randomUUID())
                .name("Artist Name")
                .build();
        PageImpl<ArtistResponse> page = new PageImpl<>(List.of(response));

        given(findAllArtistUseCase.execute(any(), any())).willReturn(page);

        mockMvc.perform(get("/v1/artists")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Artist Name"));
    }

    @Test
    @DisplayName("Should find artist by id successfully")
    void shouldFindArtistByIdSuccessfully() throws Exception {
        UUID artistId = UUID.randomUUID();
        ArtistResponse response = ArtistResponse.builder()
                .id(artistId)
                .name("Artist Name")
                .build();

        given(findByIdUseCase.execute(artistId)).willReturn(response);

        mockMvc.perform(get("/v1/artists/{id}", artistId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(artistId.toString()));
    }

    @Test
    @DisplayName("Should update artist successfully")
    void shouldUpdateArtistSuccessfully() throws Exception {
        UUID artistId = UUID.randomUUID();
        UpdateArtistRequest request = new UpdateArtistRequest();
        request.setName("Updated Artist");

        ArtistResponse response = ArtistResponse.builder()
                .id(artistId)
                .name("Updated Artist")
                .build();

        given(updateArtistsUseCase.execute(eq(artistId), any(UpdateArtistRequest.class))).willReturn(response);

        mockMvc.perform(put("/v1/artists/{id}", artistId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Artist"));
    }

    @Test
    @DisplayName("Should delete artist successfully")
    void shouldDeleteArtistSuccessfully() throws Exception {
        UUID artistId = UUID.randomUUID();

        doNothing().when(deleteArtistUseCase).execute(artistId);

        mockMvc.perform(delete("/v1/artists/{id}", artistId))
                .andExpect(status().isNoContent());
    }
}
