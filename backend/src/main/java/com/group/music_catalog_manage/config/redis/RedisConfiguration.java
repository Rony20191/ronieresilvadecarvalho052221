package com.group.music_catalog_manage.config.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class RedisConfiguration {
    private final CacheProperties cacheProperties;

    @Bean
    public RedisStandaloneConfiguration redisStandaloneConfiguration() {
        var configuration = new RedisStandaloneConfiguration(cacheProperties.getHost(), cacheProperties.getPort());
        configuration.setPassword(cacheProperties.getPassword());
        return configuration;
    }
}
