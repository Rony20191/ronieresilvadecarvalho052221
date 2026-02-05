package com.group.music_catalog_manage.application.usecases.auth;

import com.group.music_catalog_manage.application.ports.out.auth.AuthServicePort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LogoutUseCaseTest {

    @Mock
    private AuthServicePort authServicePort;

    @InjectMocks
    private LogoutUseCase logoutUseCase;

    @Test
    @DisplayName("Should logout successfully")
    void shouldLogoutSuccessfully() {
        // Arrange
        String refreshToken = "refresh-token";

        // Act
        logoutUseCase.execute(refreshToken);

        // Assert
        verify(authServicePort).logout(refreshToken);
    }
}
