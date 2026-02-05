'use client';

import { Home, BarChart3, Users, FileText, Settings, Package, CreditCard, HelpCircle, X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Artistas', href: '/artists' },
    { icon: Package, label: 'Álbuns', href: '/albums' },
];

export default function Drawer({ isOpen, onClose }: DrawerProps) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden bottom-0"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <aside
                className={`
          fixed top-0 left-0 bottom-0
           h-full w-64 bg-white dark:bg-gray-800 
          shadow-xl z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-screen
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>

                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <span className="font-semibold">Dica:</span> Use ⌘ + K para pesquisar rapidamente
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}