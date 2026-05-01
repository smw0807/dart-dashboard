# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # 개발 서버 (localhost:3000)
yarn build        # 프로덕션 빌드
yarn lint         # ESLint 검사
```

타입 체크:

```bash
./node_modules/typescript/bin/tsc --noEmit
```

> 패키지 매니저는 **yarn**만 사용한다. `npm install` 금지.

---

## Architecture

### 요청 흐름

브라우저의 React 컴포넌트는 직접 OpenDART API를 호출하지 않는다.

```
Browser (React Query 훅)
  → GET /api/disclosures?corp_code=...
  → app/api/disclosures/route.ts   ← DART_API_KEY 주입
  → https://opendart.fss.or.kr/api/list.json
```

`DART_API_KEY`는 서버 사이드(`lib/dart.ts`)에서만 사용되며, `NEXT_PUBLIC_` 접두사 절대 사용 금지.

### 레이어별 역할

| 레이어         | 경로                                  | 역할                                                                                                                      |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| API Route      | `app/api/disclosures/route.ts`        | DART API 프록시. 파라미터 파싱 후 `lib/dart.ts`에 위임                                                                    |
| API 클라이언트 | `lib/dart.ts`                         | `DART_API_KEY` 주입, fetch 호출, 날짜/URL 유틸                                                                            |
| 타입           | `types/dart.ts`                       | `Disclosure`, `SearchParams`, `WatchlistItem`, `SurgeAlert` 등 모든 도메인 타입. 공시 유형 색상·레이블 상수도 여기에 위치 |
| React Query 훅 | `hooks/useDisclosures.ts`             | `/api/disclosures` 호출, staleTime 5분                                                                                    |
| 관심종목 상태  | `hooks/useWatchlist.ts`               | localStorage 기반 관심종목 CRUD. 최대 20개 제한                                                                           |
| 유틸           | `lib/utils.ts`                        | `cn()` (clsx + tailwind-merge), `formatDate()`                                                                            |
| Provider       | `components/layout/QueryProvider.tsx` | `'use client'` QueryClient 래퍼 — `app/layout.tsx`에서 전체 앱을 감쌈                                                     |

### 페이지 구조

- `/` — 메인 대시보드 (`app/page.tsx`)
- `/company/[code]` — 기업별 공시 상세, `code`는 OpenDART `corp_code` (6자리 고유번호)

### OpenDART API 제약

- 일 요청 20,000건 제한 → React Query staleTime 5분으로 중복 호출 방지
- `corp_code` 없이 조회 시 3개월 이내로 제한됨 → 항상 `corp_code`와 함께 요청
- `corp_code`는 종목코드(stock_code)가 아닌 금감원 고유번호(6자리)
- `rcept_no`(접수번호)로 원문 뷰어 URL 생성: `lib/dart.ts`의 `getDartViewerUrl()` 사용
- 날짜 형식은 `YYYYMMDD` 문자열

---

## 코딩 철학 (Coding Philosophy)

> **좋은 코드란, 기능의 역할에 충실하면서도 다른 개발자가 쉽게 이해할 수 있는 코드다.**

성능 개선과 기능 구현도 중요하지만, **이해하기 어려운 구조는 장기적으로 더 큰 비용**이 된다.
코드를 수정하거나 확장할 때 구조 자체가 걸림돌이 되지 않도록, 읽기 쉽고 유지보수하기 좋은 코드를 작성한다.

### 1. 명확한 네이밍 (Clear Naming)

이름만 봐도 무엇을 하는지 알 수 있어야 한다.

```typescript
// ❌
const d = new Date();
const fn = (a: number, b: number) => a + b;
const list = await db.find({s: 1});

// ✅
const createdAt = new Date();
const calculateTotalPrice = (basePrice: number, taxRate: number) =>
  basePrice + basePrice * taxRate;
const activeUsers = await db.find({status: 1});
```

- **변수**: 무엇을 담고 있는지 (`userList`, `isLoading`, `totalCount`)
- **함수**: 동사로 시작, 무엇을 하는지 (`fetchUserById`, `validateEmail`, `formatDate`)
- **boolean**: `is`, `has`, `can` 접두사 (`isAuthenticated`, `hasPermission`, `canDelete`)
- **타입/인터페이스**: 명사로, 역할을 반영 (`UserProfile`, `OrderSummary`, `ApiResponse`)
- 축약어, 단일 문자 변수명 사용 금지

### 2. 단일 책임 원칙 (Single Responsibility)

하나의 함수/모듈은 하나의 일만 한다.
함수가 "그리고(and)"로 설명된다면 분리를 고려한다.
한 함수가 30줄을 넘어간다면 분리를 검토한다.

```typescript
// ❌ 하나의 함수가 너무 많은 일을 함
async function processOrder(orderId: string) {
  const order = await db.orders.findById(orderId);
  const user = await db.users.findById(order.userId);
  if (!order || !user) throw new Error('Not found');
  if (order.status !== 'pending') throw new Error('Invalid status');
  const payment = await paymentGateway.charge(
    user.cardToken,
    order.totalAmount,
  );
  await db.orders.update(orderId, {status: 'paid', paymentId: payment.id});
  await emailService.send(user.email, 'order_confirmed', {order});
}

// ✅ 각 역할을 분리
async function processOrder(orderId: string) {
  const {order, user} = await fetchOrderWithUser(orderId);
  validateOrderForPayment(order);
  const payment = await chargeOrder(user, order);
  await finalizeOrder(orderId, payment);
  await notifyOrderConfirmed(user, order);
}
```

### 3. TypeScript 실천 지침

```typescript
// ❌ any 사용 금지
function getUser(id: any): any { ... }

// ✅ 정확한 타입 사용
async function getUserById(id: string): Promise<User | null> { ... }

// ✅ 의미 있는 타입으로 의도 드러내기
type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'shipped';
```

- `any` 사용 금지. 정확한 타입 또는 제네릭 사용
- 단순 `string` 대신 의미 있는 유니온 타입 활용
- 에러 처리는 명시적으로 — 조용히 `null` 반환하지 않기

### 4. 주석 원칙

"무엇을"이 아니라 **"왜"를 설명**한다.

```typescript
// ❌ 코드를 그대로 설명
// users 배열을 순회하며 email을 가져온다
const emails = users.map((u) => u.email);

// ✅ 이유를 설명
// N+1 쿼리를 방지하기 위해 배치 조회
const userMap = await batchFetchUsersById(orderUserIds);
```

### 5. 성능 개선 시 원칙

- 복잡한 최적화 로직에는 왜 이렇게 했는지 주석 추가
- 성능을 위한 트릭은 함수로 추출해 명확한 이름 부여
- 성능보다 가독성을 우선하되, 성능 개선 시 구조도 함께 고려

### 6. 컴포넌트화

- JSX가 50줄을 넘거나, 독립적으로 재사용 가능하다면 별도 컴포넌트로 분리한다
- 상태/로직은 커스텀 훅으로, UI는 컴포넌트로 분리해 관심사를 분리한다
- `components/ui/` — 도메인 무관한 범용 UI, `components/feed/` · `components/charts/` — 도메인 특화 컴포넌트

### 7. SSR / 렌더링 전략

- 기본은 **Server Component**로 작성하고, 상태·이벤트·브라우저 API가 필요할 때만 `'use client'`를 추가한다
- `useWatchlist`(localStorage)와 차트 컴포넌트(Recharts)는 클라이언트 전용이므로 반드시 `'use client'`
- 공시 목록 초기 데이터는 Server Component에서 prefetch하여 빈 화면 노출을 방지한다
