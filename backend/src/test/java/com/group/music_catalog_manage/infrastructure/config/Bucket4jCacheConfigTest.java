package com.group.music_catalog_manage.infrastructure.config;

import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.lettuce.core.RedisClient;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class Bucket4jCacheConfigTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(Bucket4jCacheConfig.class, MockRedisConfig.class);

    @Configuration
    static class MockRedisConfig {
        @Bean
        public LettuceConnectionFactory lettuceConnectionFactory() {
            LettuceConnectionFactory factory = mock(LettuceConnectionFactory.class);
            RedisClient redisClient = mock(RedisClient.class);
            io.lettuce.core.api.StatefulRedisConnection<byte[], byte[]> connection = mock(
                    io.lettuce.core.api.StatefulRedisConnection.class);
            when(redisClient.connect(io.lettuce.core.codec.ByteArrayCodec.INSTANCE)).thenReturn(connection);
            when(factory.getNativeClient()).thenReturn(redisClient);
            return factory;
        }
    }

    @Test
    @DisplayName("Should create ProxyManager bean")
    void shouldCreateProxyManager() {
        contextRunner.run(context -> {
            assertThat(context).hasSingleBean(ProxyManager.class);
        });
    }
}
