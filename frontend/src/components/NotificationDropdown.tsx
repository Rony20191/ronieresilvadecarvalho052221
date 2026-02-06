'use client';

import { Bell, Check, Trash2, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Notification } from '@/hooks/useNotifications';

interface NotificationDropdownProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClear: () => void;
}

export default function NotificationDropdown({
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onClear,
}: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins}m atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        return `${diffDays}d atrás`;
    };

    const getNotificationIcon = (type: string, action: string) => {
        const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold";

        if (action === 'created') {
            return <div className={`${baseClasses} bg-green-500`}>+</div>;
        } else if (action === 'updated') {
            return <div className={`${baseClasses} bg-blue-500`}>✓</div>;
        } else if (action === 'deleted') {
            return <div className={`${baseClasses} bg-red-500`}>-</div>;
        }
        return <div className={`${baseClasses} bg-gray-500`}>•</div>;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                aria-label="Notificações"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Notificações
                        </h3>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={onMarkAllAsRead}
                                        className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                                        title="Marcar todas como lidas"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={onClear}
                                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                        title="Limpar todas"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications list */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhuma notificação</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                                            }`}
                                        onClick={() => onMarkAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {getNotificationIcon(notification.type, notification.action)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
