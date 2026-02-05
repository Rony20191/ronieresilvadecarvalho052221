package com.group.music_catalog_manage.infrastructure.api.exception;
import java.time.Instant;

public record RateLimitResponse(
        String title,
        int status,
        String detail,
        Instant timestamp,
        String path
) {}
