package com.group.music_catalog_manage.infrastructure.web.filter;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final ProxyManager<byte[]> proxyManager;

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
            "http://frontend:3000",
            "http://frontend:5000",
            "http://frontend:8080");

    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/ws",
            "/api/ws",
            "/swagger-ui",
            "/v3/api-docs");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Skip rate limiting for WebSocket and documentation endpoints
        if (isExcludedPath(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1. Origin Blocking
        String origin = request.getHeader("Origin");

        // Skip origin check for requests without Origin header (same-origin, curl,
        // etc.)
        if (origin != null && !ALLOWED_ORIGINS.contains(origin)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Origin not allowed");
            return;
        }

        // 2. Rate Limiting (100 requests per minute per IP)
        String clientIp = getClientIp(request);
        Bucket bucket = proxyManager.builder().build(clientIp.getBytes(), bucketConfigurationSupplier());

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Try again in " + waitForRefill + " seconds.");
        }
    }

    private boolean isExcludedPath(String path) {
        return EXCLUDED_PATHS.stream().anyMatch(path::startsWith);
    }

    private Supplier<io.github.bucket4j.BucketConfiguration> bucketConfigurationSupplier() {
        return () -> io.github.bucket4j.BucketConfiguration.builder()
                .addLimit(io.github.bucket4j.Bandwidth.builder()
                        .capacity(100)
                        .refillGreedy(100, Duration.ofMinutes(1))
                        .build())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
