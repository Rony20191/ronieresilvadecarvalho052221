package com.group.music_catalog_manage.application.ports.out.albums;


public interface AlbumCoverUrlProviderPort {
  String generateUrl(String fileKey);
}
