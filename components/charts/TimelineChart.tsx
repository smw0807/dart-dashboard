'use client';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type {TimelinePoint} from '@/hooks/useChartData';

interface TimelineChartProps {
  data: TimelinePoint[];
}

function toDisplayDate(date: string): string {
  return `${date.slice(4, 6)}/${date.slice(6, 8)}`;
}

export function TimelineChart({data}: TimelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        데이터 없음
      </div>
    );
  }

  const chartData = data.map((d) => ({...d, label: toDisplayDate(d.date)}));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart
        data={chartData}
        margin={{left: 0, right: 16, top: 4, bottom: 4}}>
        <defs>
          <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{fontSize: 11}}
          interval="preserveStartEnd"
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{fontSize: 11}}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip formatter={(value) => [`${value}건`, '공시 수']} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#countGradient)"
          dot={false}
          activeDot={{r: 4, strokeWidth: 0}}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
