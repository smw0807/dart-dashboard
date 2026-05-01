import { NextRequest, NextResponse } from 'next/server';
import { searchCorpCodes } from '@/lib/corpCodes';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name') ?? '';
  if (name.trim().length < 1) return NextResponse.json([]);

  try {
    const results = await searchCorpCodes(name);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Company search error:', error);
    return NextResponse.json(
      { error: '기업 검색 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
