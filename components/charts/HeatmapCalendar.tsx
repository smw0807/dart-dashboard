'use client';

import type { HeatmapDay } from '@/types/charts';

interface HeatmapCalendarProps {
  data: HeatmapDay[];
  days?: number;
}

function getColorClass(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count <= 2) return 'bg-blue-100';
  if (count <= 5) return 'bg-blue-300';
  if (count <= 10) return 'bg-blue-500';
  return 'bg-blue-700';
}

function buildDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10).replace(/-/g, ''));
  }
  return dates;
}

const LEGEND_CLASSES = ['bg-gray-100', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700'];

export function HeatmapCalendar({ data, days = 90 }: HeatmapCalendarProps) {
  const countMap = new Map(data.map((d) => [d.date, d.count]));
  const dates = buildDateRange(days);

  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((date) => {
              const count = countMap.get(date) ?? 0;
              const label = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}: ${count}건`;
              return (
                <div
                  key={date}
                  title={label}
                  className={`h-3 w-3 flex-shrink-0 rounded-sm ${getColorClass(count)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <span>적음</span>
        {LEGEND_CLASSES.map((cls) => (
          <div key={cls} className={`h-3 w-3 rounded-sm ${cls}`} />
        ))}
        <span>많음</span>
      </div>
    </div>
  );
}
