'use client';

import { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { authStore, AuthState } from '@/state/auth/auth.store';

export default function SessionTimer() {
    const [time, setTime] = useState<{ minutes: number; seconds: number } | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const subscription = authStore.state$.subscribe((state: AuthState) => {
            setIsAuthenticated(state.isAuthenticated);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setTime(null);
            return;
        }

        const interval = setInterval(() => {
            const remaining = authStore.getTimeRemaining();
            setTime(remaining);
        }, 1000);

        setTime(authStore.getTimeRemaining());

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await authStore.refreshToken();
        } catch (error) {
            console.error('Manual refresh failed:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    if (!isAuthenticated || !time) return null;

    const isLow = time.minutes < 2;
    const formatTime = (mins: number, secs: number) =>
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isLow
                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(time.minutes, time.seconds)}</span>
            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isRefreshing ? 'animate-spin' : ''
                    }`}
                title="Renovar sessão"
            >
                <RefreshCw className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}