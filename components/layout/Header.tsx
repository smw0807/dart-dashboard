import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <span className="text-blue-600">DART</span>
          <span>Dashboard</span>
        </Link>
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
