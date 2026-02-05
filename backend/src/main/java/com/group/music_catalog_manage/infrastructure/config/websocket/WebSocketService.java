package com.group.music_catalog_manage.infrastructure.config.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToAll(String destination, WebSocketMessage message) {
        messagingTemplate.convertAndSend("/topic/" + destination, message);
    }

    public void notifyAlbumCreated(Object album) {
        sendToAll("albums", WebSocketMessage.create("album", "created", album));
    }

    public void notifyAlbumUpdated(Object album) {
        sendToAll("albums", WebSocketMessage.create("album", "updated", album));
    }

    public void notifyAlbumDeleted(String albumId) {
        sendToAll("albums", WebSocketMessage.create("album", "deleted", albumId));
    }

    public void notifyArtistCreated(Object artist) {
        sendToAll("artists", WebSocketMessage.create("artist", "created", artist));
    }

    public void notifyArtistUpdated(Object artist) {
        sendToAll("artists", WebSocketMessage.create("artist", "updated", artist));
    }

    public void notifyArtistDeleted(String artistId) {
        sendToAll("artists", WebSocketMessage.create("artist", "deleted", artistId));
    }

    public void sendNotification(String message) {
        sendToAll("notifications", WebSocketMessage.notification(message));
    }
}
