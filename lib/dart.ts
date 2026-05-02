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
