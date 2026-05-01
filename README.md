# DART Dashboard

개인 투자자를 위한 금감원 공시 모니터링 & 시각화 대시보드

> OpenDART API를 활용해 관심 종목의 공시를 실시간으로 모니터링하고, 데이터를 차트로 시각화합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **관심 종목 관리** | 기업명 검색 후 최대 20개 종목 추가/삭제 (localStorage 저장) |
| **공시 피드** | 관심 종목의 최신 공시를 통합하여 시간순으로 표시 |
| **공시 급증 알림** | 최근 7일 공시 수가 직전 30일 평균 대비 3배 이상 급증 시 상단 알림 |
| **필터링** | 공시 유형, 기간, 최종보고서 여부로 필터링 |
| **기업 상세 페이지** | 특정 기업의 공시 히스토리 전체 조회 |
| **데이터 시각화** | 공시 캘린더 히트맵, 유형별 도넛 차트, 기업별 바 차트, 타임라인 차트 |

---

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State / Fetching**: TanStack Query (React Query v5)
- **Charts**: Recharts v3
- **Deploy**: Vercel

---

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/smw0807/dart-dashboard.git
cd dart-dashboard
```

### 2. 의존성 설치

```bash
yarn install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 열고 OpenDART API 키를 입력합니다.

```env
DART_API_KEY=your_40_character_api_key_here
```

> API 키 발급: [OpenDART 회원가입](https://opendart.fss.or.kr/uss/umt/EgovMberInsertView.do)

### 4. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

---

## 프로젝트 구조

```
dart-dashboard/
├── app/
│   ├── api/
│   │   ├── companies/          # 기업명 검색 API 라우트
│   │   └── disclosures/        # 공시 목록 조회 API 라우트 (DART 프록시)
│   ├── charts/                 # 시각화 페이지 (/charts)
│   ├── company/[code]/         # 기업 상세 페이지
│   └── page.tsx                # 메인 대시보드
├── components/
│   ├── charts/                 # 차트 컴포넌트 (Recharts)
│   ├── feed/                   # 공시 피드 & 카드
│   ├── layout/                 # 헤더, 사이드바, AppShell
│   └── ui/                     # 공통 UI (검색, 필터, 알림 배너)
├── hooks/                      # React Query 훅, 비즈니스 로직
├── lib/                        # DART API 클라이언트, 유틸
└── types/                      # TypeScript 타입 정의
```

### 요청 흐름

```
브라우저 (React Query 훅)
  → GET /api/disclosures?corp_code=...
  → app/api/disclosures/route.ts   ← DART_API_KEY 서버사이드 주입
  → https://opendart.fss.or.kr/api/list.json
```

`DART_API_KEY`는 서버 사이드에서만 사용하며 클라이언트에 노출되지 않습니다.

---

## Vercel 배포

### 1. Vercel 프로젝트 연결

```bash
vercel
```

또는 [Vercel Dashboard](https://vercel.com/new)에서 GitHub 저장소를 임포트합니다.

### 2. 환경 변수 등록

Vercel Dashboard → Settings → Environment Variables에서 아래 키를 추가합니다.

| Key | Value |
|-----|-------|
| `DART_API_KEY` | OpenDART에서 발급받은 40자리 API 키 |

### 3. 배포

```bash
vercel --prod
```

---

## OpenDART API 제약사항

- 일 요청 **20,000건** 제한 → React Query `staleTime: 5분`으로 중복 호출 방지
- `corp_code` 없이 조회 시 **3개월 이내**로 제한
- `corp_code`는 종목코드(stock_code)가 아닌 금감원 고유번호(6자리)

---

## 라이선스

MIT
