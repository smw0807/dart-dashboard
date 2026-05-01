import AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import type { WatchlistItem } from '@/types/dart';

interface CorpCodeXmlEntry {
  corp_code: string;
  corp_name: string;
  stock_code: string;
  modify_date: string;
}

// Module-level cache: shared across all requests in the same server process
let cachedCorpCodes: CorpCodeXmlEntry[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

async function loadCorpCodes(): Promise<CorpCodeXmlEntry[]> {
  const apiKey = process.env.DART_API_KEY;
  if (!apiKey) throw new Error('DART_API_KEY is not configured');

  const response = await fetch(
    `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${apiKey}`,
  );
  if (!response.ok) throw new Error(`DART corp code fetch failed: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const zip = new AdmZip(Buffer.from(buffer));
  const xmlEntry = zip.getEntry('CORPCODE.xml');
  if (!xmlEntry) throw new Error('CORPCODE.xml not found in the downloaded ZIP');

  const xmlContent = xmlEntry.getData().toString('utf8');
  const parser = new XMLParser({
    isArray: (tagName) => tagName === 'list',
  });
  const parsed = parser.parse(xmlContent) as { result: { list: CorpCodeXmlEntry[] } };

  if (!Array.isArray(parsed?.result?.list)) {
    throw new Error('Unexpected XML structure from DART corp code file');
  }

  return parsed.result.list;
}

export async function searchCorpCodes(query: string): Promise<WatchlistItem[]> {
  if (!cachedCorpCodes || Date.now() > cacheExpiresAt) {
    cachedCorpCodes = await loadCorpCodes();
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return cachedCorpCodes
    .filter((entry) => entry.corp_name.toLowerCase().includes(normalizedQuery))
    .slice(0, 15)
    .map((entry) => ({
      corp_code: entry.corp_code,
      corp_name: entry.corp_name,
      // corp_cls는 corp code XML에 없으므로 기본값 설정
      corp_cls: 'E' as const,
      stock_code: entry.stock_code?.trim() || undefined,
    }));
}
