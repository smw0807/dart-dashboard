'use client';

import { useState, useCallback } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <>
      <Header onMenuClick={openSidebar} />
      <div className="mx-auto flex max-w-screen-xl">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 sm:hidden"
            onClick={closeSidebar}
          />
        )}
        <div
          className={cn(
            'fixed top-14 bottom-0 left-0 z-50 transition-transform duration-200',
            'sm:static sm:z-auto sm:h-auto sm:translate-x-0 sm:transition-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar onClose={closeSidebar} />
        </div>
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </>
  );
}
