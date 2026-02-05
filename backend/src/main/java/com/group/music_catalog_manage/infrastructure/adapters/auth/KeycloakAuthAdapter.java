package com.group.music_catalog_manage.infrastructure.adapters.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.music_catalog_manage.application.dto.auth.AuthResponse;
import com.group.music_catalog_manage.application.ports.out.auth.AuthServicePort;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class KeycloakAuthAdapter implements AuthServicePort {

    private final ObjectMapper objectMapper;
    private final OkHttpClient client = new OkHttpClient();

    @Value("${app.keycloak.server-url}")
    private String serverUrl;

    @Value("${app.keycloak.realm}")
    private String realm;

    @Value("${app.keycloak.client-id}")
    private String clientId;

    @Value("${app.keycloak.client-secret:#{null}}")
    private String clientSecret;

    @Override
    public AuthResponse login(String username, String password) {
        String url = String.format("%s/realms/%s/protocol/openid-connect/token", serverUrl, realm);

        FormBody.Builder formBuilder = new FormBody.Builder()
                .add("grant_type", "password")
                .add("client_id", clientId)
                .add("username", username)
                .add("password", password);

        if (clientSecret != null && !clientSecret.isEmpty()) {
            formBuilder.add("client_secret", clientSecret);
        }

        RequestBody body = formBuilder.build();
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException(
                        "Login failed: " + (response.body() != null ? response.body().string() : "Unknown error"));
            }
            return objectMapper.readValue(response.body().string(), AuthResponse.class);
        } catch (IOException e) {
            throw new RuntimeException("Login failed", e);
        }
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String url = String.format("%s/realms/%s/protocol/openid-connect/token", serverUrl, realm);

        FormBody.Builder formBuilder = new FormBody.Builder()
                .add("grant_type", "refresh_token")
                .add("client_id", clientId)
                .add("refresh_token", refreshToken);

        if (clientSecret != null && !clientSecret.isEmpty()) {
            formBuilder.add("client_secret", clientSecret);
        }

        RequestBody body = formBuilder.build();
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("Refresh token failed: "
                        + (response.body() != null ? response.body().string() : "Unknown error"));
            }
            return objectMapper.readValue(response.body().string(), AuthResponse.class);
        } catch (IOException e) {
            throw new RuntimeException("Refresh token failed", e);
        }
    }

    @Override
    public void logout(String refreshToken) {
        String url = String.format("%s/realms/%s/protocol/openid-connect/logout", serverUrl, realm);

        FormBody.Builder formBuilder = new FormBody.Builder()
                .add("client_id", clientId)
                .add("refresh_token", refreshToken);

        if (clientSecret != null && !clientSecret.isEmpty()) {
            formBuilder.add("client_secret", clientSecret);
        }

        RequestBody body = formBuilder.build();
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException(
                        "Logout failed: " + (response.body() != null ? response.body().string() : "Unknown error"));
            }
        } catch (IOException e) {
            throw new RuntimeException("Logout failed", e);
        }
    }
}
