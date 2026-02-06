package com.group.music_catalog_manage.application.usecases.auth;

import com.group.music_catalog_manage.application.dto.auth.AuthResponse;
import com.group.music_catalog_manage.application.ports.out.auth.AuthServicePort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LoginUseCaseTest {

    @Mock
    private AuthServicePort authServicePort;

    @InjectMocks
    private LoginUseCase loginUseCase;

    @Test
    @DisplayName("Should login successfully")
    void shouldLoginSuccessfully() {
        String username = "user";
        String password = "password";
        AuthResponse response = new AuthResponse();
        response.setAccessToken("token");
        response.setRefreshToken("refresh");
        response.setExpiresIn(3600);
        response.setRefreshExpiresIn(7200);
        response.setTokenType("Bearer");

        given(authServicePort.login(username, password)).willReturn(response);

        AuthResponse result = loginUseCase.execute(username, password);

        assertThat(result).isNotNull();
        assertThat(result.getAccessToken()).isEqualTo("token");
        verify(authServicePort).login(username, password);
    }
}