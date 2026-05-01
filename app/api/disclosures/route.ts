import { NextRequest, NextResponse } from 'next/server';
import { fetchDisclosures } from '@/lib/dart';
import type { SearchParams, DisclosureType, CorpClass } from '@/types/dart';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const params: SearchParams = {
    corp_code: searchParams.get('corp_code') ?? undefined,
    bgn_de: searchParams.get('bgn_de') ?? undefined,
    end_de: searchParams.get('end_de') ?? undefined,
    pblntf_ty: (searchParams.get('pblntf_ty') as DisclosureType) ?? undefined,
    corp_cls: (searchParams.get('corp_cls') as CorpClass) ?? undefined,
    page_no: searchParams.get('page_no') ? Number(searchParams.get('page_no')) : undefined,
    page_count: searchParams.get('page_count') ? Number(searchParams.get('page_count')) : undefined,
    last_reprt_at: (searchParams.get('last_reprt_at') as 'Y' | 'N') ?? undefined,
  };

  try {
    const data = await fetchDisclosures(params);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
