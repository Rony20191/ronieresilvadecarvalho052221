package com.group.music_catalog_manage.infrastructure.config.minio;

import io.minio.MinioClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(MinioProps.class)
public class MinioConfiguration {
 @Bean
    public MinioClient minioClient(MinioProps props) throws Exception {
     return MinioClient.builder()
             .endpoint(props.getUrl())
             .credentials(props.getAccessKey(), props.getSecretKey())
             .build();
     }
}
