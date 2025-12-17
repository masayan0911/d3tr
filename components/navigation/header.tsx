'use client';

import { formatDateWithDay, getToday } from '@/lib/utils/date';

interface HeaderProps {
  title?: string;
  showDate?: boolean;
}

export function Header({ title = 'D3TR', showDate = true }: HeaderProps) {
  const today = getToday();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 safe-area-top">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-emerald-600">{title}</h1>
        {showDate && (
          <span className="text-sm text-gray-600">{formatDateWithDay(today)}</span>
        )}
      </div>
    </header>
  );
}
