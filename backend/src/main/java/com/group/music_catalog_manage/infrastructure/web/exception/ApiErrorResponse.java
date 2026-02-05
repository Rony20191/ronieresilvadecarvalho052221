package com.group.music_catalog_manage.infrastructure.web.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        int status,
        String message,
        List<String> details,
        Instant timestamp) {
}
