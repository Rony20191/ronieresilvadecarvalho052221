package com.group.music_catalog_manage.infrastructure.config.minio;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Getter
@Setter
@ConfigurationProperties(prefix = "spring.minio")
public class MinioProps {
    private String url;
    private String bucket;
    private String accessKey;
    private String secretKey;
}
