'use client';

import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-100 sm:hidden"
            aria-label="메뉴 열기"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
            <span className="text-blue-600">DART</span>
            <span>Dashboard</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            대시보드
          </Link>
          <Link href="/charts" className="hover:text-gray-900">
            차트
          </Link>
        </nav>
      </div>
    </header>
  );
}
