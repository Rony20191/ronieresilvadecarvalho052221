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
class RefreshTokenUseCaseTest {

    @Mock
    private AuthServicePort authServicePort;

    @InjectMocks
    private RefreshTokenUseCase refreshTokenUseCase;

    @Test
    @DisplayName("Should refresh token successfully")
    void shouldRefreshTokenSuccessfully() {
        // Arrange
        String refreshToken = "old-refresh";
        AuthResponse response = new AuthResponse();
        response.setAccessToken("new-token");
        response.setRefreshToken("new-refresh");
        response.setExpiresIn(3600);
        response.setRefreshExpiresIn(7200);
        response.setTokenType("Bearer");

        given(authServicePort.refreshToken(refreshToken)).willReturn(response);

        // Act
        AuthResponse result = refreshTokenUseCase.execute(refreshToken);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getAccessToken()).isEqualTo("new-token");
        verify(authServicePort).refreshToken(refreshToken);
    }
}
