'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import AppBar from '@/components/AppBar';
import Drawer from '@/components/Drawer';
import { usePathname, useRouter } from 'next/navigation';
import { authStore } from '@/state/auth/auth.store';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState(authStore.snapshot);
  const [mounted, setMounted] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    setMounted(true);
    const sub = authStore.state$.subscribe(state => {
      setAuthState(state);

      if (!state.isAuthenticated && pathname !== '/login') {
        router.push('/login');
      }

      if (state.isAuthenticated && pathname === '/login') {
        router.push('/');
      }
    });

    return () => sub.unsubscribe();
  }, [pathname, router]);

  const isLoginPage = pathname === '/login';

  if (!mounted) {
    return (
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`} suppressHydrationWarning>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR" className={isDarkMode ? 'dark' : ''} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-50`}>
        {isLoginPage || !authState.isAuthenticated ? (
          <main className="min-h-screen">
            {children}
          </main>
        ) : (
          <div className="flex flex-col min-h-screen">
            <AppBar
              toggleDrawer={toggleDrawer}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />

            <div className="flex flex-1 overflow-hidden ">
              <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
              />

              <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}