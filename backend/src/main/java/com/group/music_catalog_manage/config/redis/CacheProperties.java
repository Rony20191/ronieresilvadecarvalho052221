package com.group.music_catalog_manage.config.redis;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "spring.redis")
public class CacheProperties {
    private String host;
    private Integer port;
    private String password;
}
