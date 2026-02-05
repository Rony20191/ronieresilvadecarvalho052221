package com.group.music_catalog_manage.application.ports.out.auth;

import com.group.music_catalog_manage.application.dto.auth.AuthResponse;

public interface AuthServicePort {
    AuthResponse login(String username, String password);

    AuthResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}
