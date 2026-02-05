package com.group.music_catalog_manage.application.usecases.auth;

import com.group.music_catalog_manage.application.dto.auth.AuthResponse;
import com.group.music_catalog_manage.application.ports.out.auth.AuthServicePort;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenUseCase {
    private final AuthServicePort authServicePort;

    public AuthResponse execute(String refreshToken) {
        return authServicePort.refreshToken(refreshToken);
    }
}
