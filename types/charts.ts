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
