package com.group.music_catalog_manage.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
class JacksonConfigTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StandardServletMultipartResolver multipartResolver;

    @Test
    @DisplayName("Should configure ObjectMapper correctly")
    void shouldConfigureObjectMapperCorrectly() {
        assertThat(objectMapper).isNotNull();
        assertThat(objectMapper.getRegisteredModuleIds()).contains("jackson-datatype-jsr310");
        assertThat(objectMapper.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)).isFalse();
    }

    @Test
    @DisplayName("Should configure multipartResolver correctly")
    void shouldConfigureMultipartResolverCorrectly() {
        assertThat(multipartResolver).isNotNull();
    }
}
