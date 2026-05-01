import type { DartApiResponse, SearchParams } from '@/types/dart';

const DART_BASE_URL = 'https://opendart.fss.or.kr/api';

export async function fetchDisclosures(params: SearchParams): Promise<DartApiResponse> {
  const apiKey = process.env.DART_API_KEY;
  if (!apiKey) throw new Error('DART_API_KEY is not configured');

  const query = new URLSearchParams({
    crtfc_key: apiKey,
    page_no: String(params.page_no ?? 1),
    page_count: String(params.page_count ?? 40),
    ...(params.corp_code && { corp_code: params.corp_code }),
    ...(params.bgn_de && { bgn_de: params.bgn_de }),
    ...(params.end_de && { end_de: params.end_de }),
    ...(params.pblntf_ty && { pblntf_ty: params.pblntf_ty }),
    ...(params.corp_cls && { corp_cls: params.corp_cls }),
    ...(params.last_reprt_at && { last_reprt_at: params.last_reprt_at }),
  });

  const res = await fetch(`${DART_BASE_URL}/list.json?${query}`, {
    next: { revalidate: 300 }, // 5분 캐시
  });

  if (!res.ok) throw new Error(`DART API error: ${res.status}`);

  const data: DartApiResponse = await res.json();

  if (data.status !== '000') {
    throw new Error(`DART API responded: ${data.status} - ${data.message}`);
  }

  return data;
}

export function getDartViewerUrl(rcept_no: string): string {
  return `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rcept_no}`;
}

/** YYYYMMDD → Date 객체 */
export function parseDartDate(dateStr: string): Date {
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  return new Date(`${y}-${m}-${d}`);
}

/** N일 전 날짜를 YYYYMMDD 문자열로 반환 */
export function daysAgoString(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}
