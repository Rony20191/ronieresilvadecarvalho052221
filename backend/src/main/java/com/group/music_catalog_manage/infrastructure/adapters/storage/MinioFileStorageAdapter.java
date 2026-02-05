package com.group.music_catalog_manage.infrastructure.adapters.storage;

import com.group.music_catalog_manage.application.ports.out.storage.FileStoragePort;
import com.group.music_catalog_manage.infrastructure.config.minio.MinioProps;
import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.GetObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioFileStorageAdapter implements FileStoragePort {

    private final MinioClient minioClient;
    private final MinioProps minioProps;

    @Override
    public String upload(InputStream inputStream, long size, String contentType, String originalFilename) {
        try {
            String safeFilename = (originalFilename != null) ? originalFilename.replace(" ", "_") : "unknown_file";
            String fileName = UUID.randomUUID() + "-" + safeFilename;

            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(minioProps.getBucket()).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(minioProps.getBucket()).build());
            }

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioProps.getBucket())
                            .object(fileName)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build());

            return fileName;
        } catch (Exception e) {
            log.error("Error uploading file to Minio", e);
            throw new RuntimeException("Error uploading file to storage", e);
        }
    }

    public String upload(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot upload empty file");
            }
            return upload(file.getInputStream(), file.getSize(), file.getContentType(), file.getOriginalFilename());
        } catch (Exception e) {
            log.error("Error uploading multipart file to Minio", e);
            throw new RuntimeException("Error uploading file to storage", e);
        }
    }

    public InputStream download(String fileName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(minioProps.getBucket())
                            .object(fileName)
                            .build());
        } catch (Exception e) {
            log.error("Error downloading file from Minio", e);
            throw new RuntimeException("Error downloading file from storage", e);
        }
    }

    public void delete(String fileName) {
        try {
            minioClient.removeObject(
                    io.minio.RemoveObjectArgs.builder()
                            .bucket(minioProps.getBucket())
                            .object(fileName)
                            .build());
        } catch (Exception e) {
            log.error("Error deleting file from Minio", e);
            throw new RuntimeException("Error deleting file from storage", e);
        }
    }

    @Override
    public String generatePresignedUrl(String fileName) {
        return generatePresignedUrl(fileName, 30);
    }

    @Override
    public String generatePresignedUrl(String fileName, int expirationMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(minioProps.getBucket())
                            .object(fileName)
                            .expiry(expirationMinutes, TimeUnit.MINUTES)
                            .build());
        } catch (Exception e) {
            log.error("Error generating presigned URL", e);
            return null;
        }
    }
}
