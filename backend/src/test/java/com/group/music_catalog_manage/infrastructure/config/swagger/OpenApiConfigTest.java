package com.group.music_catalog_manage.infrastructure.config.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

class OpenApiConfigTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(OpenApiConfig.class);

    @Test
    @DisplayName("Should create OpenAPI bean with correct metadata")
    void shouldCreateOpenApiBean() {
        contextRunner.run(context -> {
            assertThat(context).hasSingleBean(OpenAPI.class);
            OpenAPI openAPI = context.getBean(OpenAPI.class);
            assertThat(openAPI.getInfo().getTitle()).isEqualTo("Music Catalog Management API");
            assertThat(openAPI.getServers()).hasSize(2);
            assertThat(openAPI.getComponents().getSecuritySchemes()).containsKey("bearerAuth");
        });
    }
}
