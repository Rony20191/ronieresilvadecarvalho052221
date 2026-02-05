package com.group.music_catalog_manage.infrastructure.config.redis;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "spring.cache.redis")
public class CacheProperties {
    private String host;
    private Integer port;
    private String password;
}
