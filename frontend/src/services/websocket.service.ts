import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketMessage {
    type: string;
    entity: string;
    action: string;
    data: any;
    timestamp: string;
}

type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketClient {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private handlers: Map<string, Set<MessageHandler>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private isConnecting = false;

    connect(): Promise<void> {
        if (this.client?.connected || this.isConnecting) {
            return Promise.resolve();
        }

        this.isConnecting = true;

        return new Promise((resolve, reject) => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

            this.client = new Client({
                webSocketFactory: () => new SockJS(`${baseUrl}/api/ws`),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('[WebSocket]', str);
                    }
                },
                onConnect: () => {
                    console.log('[WebSocket] Connected');
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    this.resubscribeAll();
                    resolve();
                },
                onStompError: (frame) => {
                    console.error('[WebSocket] STOMP Error:', frame);
                    this.isConnecting = false;
                    reject(new Error(frame.body));
                },
                onDisconnect: () => {
                    console.log('[WebSocket] Disconnected');
                    this.isConnecting = false;
                },
                onWebSocketClose: () => {
                    console.log('[WebSocket] Connection closed');
                    this.isConnecting = false;
                    this.handleReconnect();
                },
            });

            this.client.activate();
        });
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[WebSocket] Reconnecting... Attempt ${this.reconnectAttempts}`);
            setTimeout(() => this.connect(), 5000);
        }
    }

    private resubscribeAll(): void {
        this.handlers.forEach((_, topic) => {
            this.subscribeToTopic(topic);
        });
    }

    private subscribeToTopic(topic: string): void {
        if (!this.client?.connected) return;

        const subscription = this.client.subscribe(`/topic/${topic}`, (message: IMessage) => {
            try {
                const parsedMessage: WebSocketMessage = JSON.parse(message.body);
                const topicHandlers = this.handlers.get(topic);
                topicHandlers?.forEach(handler => handler(parsedMessage));
            } catch (error) {
                console.error('[WebSocket] Error parsing message:', error);
            }
        });

        this.subscriptions.set(topic, subscription);
    }

    subscribe(topic: string, handler: MessageHandler): () => void {
        if (!this.handlers.has(topic)) {
            this.handlers.set(topic, new Set());
        }
        this.handlers.get(topic)!.add(handler);

        if (!this.subscriptions.has(topic) && this.client?.connected) {
            this.subscribeToTopic(topic);
        }

        return () => {
            const handlers = this.handlers.get(topic);
            handlers?.delete(handler);

            if (handlers?.size === 0) {
                this.subscriptions.get(topic)?.unsubscribe();
                this.subscriptions.delete(topic);
                this.handlers.delete(topic);
            }
        };
    }

    disconnect(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.clear();
        this.handlers.clear();
        this.client?.deactivate();
        this.client = null;
    }

    get isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}

export const webSocketClient = new WebSocketClient();