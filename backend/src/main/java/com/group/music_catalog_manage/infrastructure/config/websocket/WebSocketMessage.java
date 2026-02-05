package com.group.music_catalog_manage.infrastructure.config.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    private String type;
    private String entity;
    private String action;
    private Object data;
    private Instant timestamp;

    public static WebSocketMessage create(String entity, String action, Object data) {
        return WebSocketMessage.builder()
                .type("ENTITY_UPDATE")
                .entity(entity)
                .action(action)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static WebSocketMessage notification(String message) {
        return WebSocketMessage.builder()
                .type("NOTIFICATION")
                .data(message)
                .timestamp(Instant.now())
                .build();
    }
}
