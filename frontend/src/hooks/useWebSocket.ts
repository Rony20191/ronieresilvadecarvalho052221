'use client';

import { useEffect, useCallback, useState } from 'react';
import { webSocketClient, WebSocketMessage } from '@/services/websocket.service';

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        webSocketClient.connect().then(() => {
            setIsConnected(true);
        }).catch((error) => {
            console.error('WebSocket connection failed:', error);
            setIsConnected(false);
        });

        return () => {
            // Don't disconnect on unmount as other components might be using it
        };
    }, []);

    const subscribe = useCallback((topic: string, handler: (message: WebSocketMessage) => void) => {
        return webSocketClient.subscribe(topic, handler);
    }, []);

    return { isConnected, subscribe };
}

export function useAlbumUpdates(
    onCreated?: (album: any) => void,
    onUpdated?: (album: any) => void,
    onDeleted?: (albumId: string) => void
) {
    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe('albums', (message) => {
            switch (message.action) {
                case 'created':
                    onCreated?.(message.data);
                    break;
                case 'updated':
                    onUpdated?.(message.data);
                    break;
                case 'deleted':
                    onDeleted?.(message.data);
                    break;
            }
        });

        return unsubscribe;
    }, [subscribe, onCreated, onUpdated, onDeleted]);
}

export function useArtistUpdates(
    onCreated?: (artist: any) => void,
    onUpdated?: (artist: any) => void,
    onDeleted?: (artistId: string) => void
) {
    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe('artists', (message) => {
            switch (message.action) {
                case 'created':
                    onCreated?.(message.data);
                    break;
                case 'updated':
                    onUpdated?.(message.data);
                    break;
                case 'deleted':
                    onDeleted?.(message.data);
                    break;
            }
        });

        return unsubscribe;
    }, [subscribe, onCreated, onUpdated, onDeleted]);
}

export function useNotifications(onNotification?: (message: string) => void) {
    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe('notifications', (message) => {
            if (message.type === 'NOTIFICATION') {
                onNotification?.(message.data as string);
            }
        });

        return unsubscribe;
    }, [subscribe, onNotification]);
}
