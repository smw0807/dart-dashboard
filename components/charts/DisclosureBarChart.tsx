'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CorpBar } from '@/types/charts';

interface DisclosureBarChartProps {
  data: CorpBar[];
}

export function DisclosureBarChart({ data }: DisclosureBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        데이터 없음
      </div>
    );
  }

  const chartHeight = Math.max(200, data.length * 36);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="corp_name"
          width={72}
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip formatter={(value) => [`${value}건`, '공시 수']} />
        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
