'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { authStore } from '@/state/auth/auth.store';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [authState, setAuthState] = useState(authStore.snapshot);

    useEffect(() => {
        const sub = authStore.state$.subscribe(setAuthState);
        return () => sub.unsubscribe();
    }, []);

    const user = {
        name: authState.user?.username || 'Convidado',
        email: 'user@music.com',
        role: authState.isAuthenticated ? 'Membro' : 'Visitante',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authState.user?.username || 'Guest'}`
    };

    const handleLogout = async () => {
        await authStore.logout();
        setIsOpen(false);
        window.location.href = '/login';
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <div className="flex items-center space-x-2">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                        <a
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4 mr-3" />
                            Meu Perfil
                        </a>

                        <a
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="w-4 h-4 mr-3" />
                            Configurações
                        </a>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sair da Conta
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}