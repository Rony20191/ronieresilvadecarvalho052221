package com.group.music_catalog_manage.infrastructure.adapters.storage;

import com.group.music_catalog_manage.application.ports.out.albums.AlbumCoverUrlProviderPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioAlbumCoverUrlAdapter implements AlbumCoverUrlProviderPort {

    private final MinioFileStorageAdapter minioFileStorage;
    
    @Override
    public String generateUrl(String fileKey) {
        return minioFileStorage.generatePresignedUrl(fileKey);
    }
    
}
