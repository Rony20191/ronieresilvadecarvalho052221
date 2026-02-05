package com.group.music_catalog_manage.application.usecases.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.group.music_catalog_manage.application.ports.out.auth.AuthServicePort;

@Service
@RequiredArgsConstructor
public class LogoutUseCase {
    private final AuthServicePort authServicePort;

    public void execute(String refreshToken) {
        authServicePort.logout(refreshToken);
    }
}
