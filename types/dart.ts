export interface Disclosure {
  rcept_no: string;       // 접수번호
  dcm_no: string;         // 문서번호
  rcept_dt: string;       // 접수일자 (YYYYMMDD)
  corp_cls: CorpClass;    // 법인구분
  corp_code: string;      // 고유번호
  corp_name: string;      // 기업명
  report_nm: string;      // 보고서명
  flr_nm: string;         // 공시 제출인명
  rm: string;             // 비고
  pblntf_ty: DisclosureType;  // 공시 유형
  pblntf_detail_ty: string;   // 공시 세부 유형
  last_reprt_at: 'Y' | 'N';  // 최종보고서 여부
}

export type DisclosureType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type CorpClass = 'Y' | 'K' | 'N' | 'E';

export const DISCLOSURE_TYPE_LABEL: Record<DisclosureType, string> = {
  A: '정기공시',
  B: '주요사항보고',
  C: '발행공시',
  D: '지분공시',
  E: '기타공시',
  F: '외부감사관련',
  G: '펀드공시',
  H: '자산유동화',
  I: '거래소공시',
  J: '공정위공시',
};

export const DISCLOSURE_TYPE_COLOR: Record<DisclosureType, string> = {
  A: 'bg-blue-100 text-blue-700',
  B: 'bg-red-100 text-red-700',
  C: 'bg-purple-100 text-purple-700',
  D: 'bg-yellow-100 text-yellow-700',
  E: 'bg-gray-100 text-gray-700',
  F: 'bg-orange-100 text-orange-700',
  G: 'bg-green-100 text-green-700',
  H: 'bg-teal-100 text-teal-700',
  I: 'bg-indigo-100 text-indigo-700',
  J: 'bg-pink-100 text-pink-700',
};

export const CORP_CLASS_LABEL: Record<CorpClass, string> = {
  Y: '코스피',
  K: '코스닥',
  N: '코넥스',
  E: '기타',
};

export interface DartApiResponse {
  status: string;
  message: string;
  page_no: number;
  page_count: number;
  total_count: number;
  total_page: number;
  list: Disclosure[];
}

export interface SearchParams {
  corp_code?: string;
  bgn_de?: string;
  end_de?: string;
  pblntf_ty?: DisclosureType;
  corp_cls?: CorpClass;
  page_no?: number;
  page_count?: number;
  last_reprt_at?: 'Y' | 'N';
}

export interface WatchlistItem {
  corp_code: string;
  corp_name: string;
  corp_cls: CorpClass;
  stock_code?: string;
}

export interface SurgeAlert {
  corp_code: string;
  corp_name: string;
  recent7: number;
  prev30avg: number;
  ratio: number;
}

export interface FeedFilters {
  pblntf_ty: DisclosureType | '';
  bgn_de: string;
  end_de: string;
  last_reprt_at: 'Y' | 'N' | '';
}
