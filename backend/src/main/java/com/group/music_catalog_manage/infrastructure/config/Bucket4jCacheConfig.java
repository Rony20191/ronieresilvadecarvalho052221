package com.group.music_catalog_manage.infrastructure.config;

import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
public class Bucket4jCacheConfig {

    @Bean
    public ProxyManager<byte[]> proxyManager(
            LettuceConnectionFactory redisConnectionFactory
    ) {
        RedisClient redisClient =
                (RedisClient) redisConnectionFactory.getNativeClient();

        return LettuceBasedProxyManager
                .builderFor(redisClient)
                .build();
    }
}

