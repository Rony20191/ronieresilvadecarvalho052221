package com.group.music_catalog_manage.application.ports.out.storage;

import java.io.InputStream;

public interface FileStoragePort {
    String upload(
            InputStream inputStream,
            long size,
            String contentType,
            String originalFilename);

    void delete(String fileKey);

    String generatePresignedUrl(String fileKey);

    String generatePresignedUrl(String fileKey, int expirationMinutes);

    InputStream download(String fileName);
}
