'use client';

import { useState, useEffect, useCallback } from 'react';
import { webSocketClient, WebSocketMessage } from '@/services/websocket.service';
import { playNotificationSound } from '@/utils/notificationSound';

export interface Notification {
    id: string;
    type: 'album' | 'artist';
    action: 'created' | 'updated' | 'deleted';
    message: string;
    timestamp: string;
    read: boolean;
    data?: any;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('[Notifications] User not authenticated, skipping WebSocket connection');
            return;
        }

        // Connect to WebSocket
        console.log('[Notifications] Connecting to WebSocket...');
        webSocketClient.connect()
            .then(() => {
                console.log('[Notifications] WebSocket connected successfully');
                setIsConnected(true);
            })
            .catch((error) => {
                console.error('[Notifications] Failed to connect to WebSocket:', error);
                setIsConnected(false);
            });

        // Subscribe to album updates
        const unsubscribeAlbums = webSocketClient.subscribe('albums', (message: WebSocketMessage) => {
            const notification: Notification = {
                id: `${message.entity}-${message.action}-${Date.now()}`,
                type: 'album',
                action: message.action as 'created' | 'updated' | 'deleted',
                message: getAlbumMessage(message.action, message.data),
                timestamp: message.timestamp,
                read: false,
                data: message.data,
            };
            addNotification(notification);
        });

        // Subscribe to artist updates
        const unsubscribeArtists = webSocketClient.subscribe('artists', (message: WebSocketMessage) => {
            const notification: Notification = {
                id: `${message.entity}-${message.action}-${Date.now()}`,
                type: 'artist',
                action: message.action as 'created' | 'updated' | 'deleted',
                message: getArtistMessage(message.action, message.data),
                timestamp: message.timestamp,
                read: false,
                data: message.data,
            };
            addNotification(notification);
        });

        return () => {
            console.log('[Notifications] Cleaning up WebSocket subscriptions');
            unsubscribeAlbums();
            unsubscribeArtists();
            setIsConnected(false);
        };
    }, []); // Empty dependency array - only run once on mount

    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
        setUnreadCount(prev => prev + 1);

        // Play notification sound
        playNotificationSound();
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
    };
}

function getAlbumMessage(action: string, data: any): string {
    const title = data?.title || 'Álbum';
    switch (action) {
        case 'created':
            return `Novo álbum "${title}" foi criado`;
        case 'updated':
            return `Álbum "${title}" foi atualizado`;
        case 'deleted':
            return `Álbum foi removido`;
        default:
            return `Álbum "${title}" foi modificado`;
    }
}

function getArtistMessage(action: string, data: any): string {
    const name = data?.name || 'Artista';
    switch (action) {
        case 'created':
            return `Novo artista "${name}" foi criado`;
        case 'updated':
            return `Artista "${name}" foi atualizado`;
        case 'deleted':
            return `Artista foi removido`;
        default:
            return `Artista "${name}" foi modificado`;
    }
}
