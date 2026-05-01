'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TypeSlice } from '@/hooks/useChartData';

interface DonutChartProps {
  data: TypeSlice[];
}

export function DonutChart({ data }: DonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        데이터 없음
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}건`]} />
        <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
