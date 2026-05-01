import { useMemo } from 'react';
import type { Disclosure } from '@/types/dart';
import { DISCLOSURE_TYPE_LABEL, DISCLOSURE_TYPE_CHART_COLOR } from '@/types/dart';

export interface HeatmapDay {
  date: string; // YYYYMMDD
  count: number;
}

export interface TypeSlice {
  name: string;
  value: number;
  color: string;
}

export interface CorpBar {
  corp_name: string;
  count: number;
}

export interface TimelinePoint {
  date: string; // YYYYMMDD
  count: number;
}

export interface ChartData {
  heatmap: HeatmapDay[];
  donut: TypeSlice[];
  bars: CorpBar[];
  timeline: TimelinePoint[];
}

export function useChartData(disclosures: Disclosure[]): ChartData {
  return useMemo(() => {
    const heatmapMap = new Map<string, number>();
    const typeMap = new Map<string, number>();
    const corpMap = new Map<string, number>();

    for (const d of disclosures) {
      heatmapMap.set(d.rcept_dt, (heatmapMap.get(d.rcept_dt) ?? 0) + 1);
      typeMap.set(d.pblntf_ty, (typeMap.get(d.pblntf_ty) ?? 0) + 1);
      corpMap.set(d.corp_name, (corpMap.get(d.corp_name) ?? 0) + 1);
    }

    const heatmap = Array.from(heatmapMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const donut = Array.from(typeMap.entries())
      .map(([type, value]) => ({
        name: DISCLOSURE_TYPE_LABEL[type as keyof typeof DISCLOSURE_TYPE_LABEL] ?? type,
        value,
        color: DISCLOSURE_TYPE_CHART_COLOR[type as keyof typeof DISCLOSURE_TYPE_CHART_COLOR] ?? '#6b7280',
      }))
      .sort((a, b) => b.value - a.value);

    const bars = Array.from(corpMap.entries())
      .map(([corp_name, count]) => ({ corp_name, count }))
      .sort((a, b) => b.count - a.count);

    // heatmap과 timeline은 같은 날짜별 집계 데이터
    const timeline = [...heatmap];

    return { heatmap, donut, bars, timeline };
  }, [disclosures]);
}
