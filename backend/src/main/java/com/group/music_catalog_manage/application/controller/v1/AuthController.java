package com.group.music_catalog_manage.application.controller.v1;

import com.group.music_catalog_manage.application.dto.auth.AuthResponse;
import com.group.music_catalog_manage.application.dto.auth.LoginRequest;
import com.group.music_catalog_manage.application.dto.auth.RefreshTokenRequest;
import com.group.music_catalog_manage.application.usecases.auth.LoginUseCase;
import com.group.music_catalog_manage.application.usecases.auth.LogoutUseCase;
import com.group.music_catalog_manage.application.usecases.auth.RefreshTokenUseCase;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Auth Controller", description = "Authentication Management")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final LogoutUseCase logoutUseCase;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginUseCase.execute(request.getUsername(), request.getPassword()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(refreshTokenUseCase.execute(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        logoutUseCase.execute(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
