package com.group.music_catalog_manage.application.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.music_catalog_manage.application.dto.auth.AuthResponse;
import com.group.music_catalog_manage.application.dto.auth.LoginRequest;
import com.group.music_catalog_manage.application.dto.auth.RefreshTokenRequest;
import com.group.music_catalog_manage.application.usecases.auth.LoginUseCase;
import com.group.music_catalog_manage.application.usecases.auth.LogoutUseCase;
import com.group.music_catalog_manage.application.usecases.auth.RefreshTokenUseCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LoginUseCase loginUseCase;
    @MockitoBean
    private RefreshTokenUseCase refreshTokenUseCase;
    @MockitoBean
    private LogoutUseCase logoutUseCase;

    @Test
    @DisplayName("Should login successfully")
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("password");

        AuthResponse response = new AuthResponse();
        response.setAccessToken("token");
        response.setRefreshToken("refresh");
        response.setExpiresIn(3600);
        response.setRefreshExpiresIn(7200);
        response.setTokenType("Bearer");

        given(loginUseCase.execute("user", "password")).willReturn(response);

        mockMvc.perform(post("/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").value("token"));
    }

    @Test
    @DisplayName("Should refresh token successfully")
    void shouldRefreshTokenSuccessfully() throws Exception {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("old-refresh");

        AuthResponse response = new AuthResponse();
        response.setAccessToken("new-token");
        response.setRefreshToken("new-refresh");
        response.setExpiresIn(3600);
        response.setRefreshExpiresIn(7200);
        response.setTokenType("Bearer");

        given(refreshTokenUseCase.execute("old-refresh")).willReturn(response);

        mockMvc.perform(post("/v1/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").value("new-token"));
    }

    @Test
    @DisplayName("Should logout successfully")
    void shouldLogoutSuccessfully() throws Exception {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("refresh-token");

        doNothing().when(logoutUseCase).execute("refresh-token");

        mockMvc.perform(post("/v1/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());
    }
}
