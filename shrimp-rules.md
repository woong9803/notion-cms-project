# 🤖 DevPath - AI 개발 가이드라인

**프로젝트**: DevPath - Notion CMS 기반 학습 로드맵 & 데브로그 웹사이트
**스택**: Next.js 15.5.3 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
**상태**: Phase 1 진행 중 (2026-04-01)

---

## 1. 프로젝트 개요

**목적**: Notion API를 CMS로 활용하여 학습 진척도를 시각화하고 데브로그를 공유하는 웹 대시보드

**핵심 기능**:
- 학습 타임라인 시각화
- 진척도 트래킹 대시보드
- 마크다운 기반 데브로그 뷰어
- 상태별/카테고리별 필터링

**주요 제약사항**:
- Notion API 레이트 제한: 분당 3회 요청 제한
- Rich Text 렌더링 복잡도 (다양한 포맷 지원 필요)
- 이미지 호스팅 전략 필요 (Notion 외부 저장소)

---

## 2. 프로젝트 아키텍처

### 2.1 디렉토리 구조 (필수 준수)

```
src/
├── app/                    # 🚀 Next.js App Router 페이지
│   ├── layout.tsx         # 루트 레이아웃 (전역 설정)
│   ├── page.tsx           # 홈페이지 (/)
│   ├── globals.css        # 전역 CSS
│   ├── login/             # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   ├── roadmap/           # 로드맵 페이지 (Phase 3)
│   └── detail/[id]/       # 상세 페이지 (Phase 4)
│
├── components/            # 🧩 React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트 (비즈니스 로직 없음)
│   ├── layout/           # 레이아웃 컴포넌트 (header, footer, container)
│   ├── navigation/       # 네비게이션 컴포넌트
│   ├── sections/         # 페이지 섹션 컴포넌트
│   ├── providers/        # Context 프로바이더
│   ├── forms/            # 폼 컴포넌트 (로그인, 가입 등)
│   ├── dashboard/        # 대시보드 전용 컴포넌트 (Phase 2)
│   └── timeline/         # 타임라인 컴포넌트 (Phase 3)
│
├── lib/                  # 🛠️ 유틸리티 함수
│   ├── utils.ts         # 공통 유틸 (cn, formatting 등)
│   ├── env.ts           # 환경 변수 검증
│   ├── notion-client.ts # Notion API 클라이언트 (Phase 2)
│   └── cache.ts         # 캐싱 로직 (Phase 2)
│
├── hooks/               # 🎣 커스텀 훅
│   └── use-learning-data.ts # 학습 데이터 관련 훅 (Phase 2)
│
├── types/              # 📝 TypeScript 타입 정의
│   ├── notion.ts       # Notion API 관련 타입
│   ├── learning.ts     # 학습 데이터 타입 (LearningItem, Category, Status)
│   └── api.ts          # API 응답 타입
│
└── services/           # 🔌 API 통신 로직
    └── notion-service.ts # Notion 데이터 패칭 (Phase 2)

docs/
├── PRD.md             # 📋 제품 요구사항 문서
├── ROADMAP.md         # 🗺️ 개발 로드맵
└── guides/            # 📚 개발 가이드 문서

```

### 2.2 파일명 컨벤션

| 유형 | 규칙 | 예시 |
|------|------|------|
| 페이지 | `page.tsx` (App Router) | `src/app/roadmap/page.tsx` |
| 레이아웃 | `layout.tsx` | `src/app/roadmap/layout.tsx` |
| 컴포넌트 | PascalCase | `UserAvatar.tsx`, `MainNav.tsx` |
| 타입 파일 | 모듈 단위 + `.ts` | `types/learning.ts` |
| 서비스 파일 | `[service]-service.ts` | `services/notion-service.ts` |
| 훅 | `use[Feature].ts` | `hooks/useLearningData.ts` |
| 유틸 | 소문자 + kebab-case | `lib/markdown-parser.ts` |

---

## 3. 코드 표준

### 3.1 TypeScript 규칙 (엄격 준수)

- **any 타입 금지**: 모든 변수/함수의 타입을 명시적으로 정의
- **Interface 우선**: 타입 정의는 `interface` 또는 `type` 사용
- **Props 타입**: 컴포넌트 props는 반드시 타입 정의

```typescript
// ❌ 금지
const data: any = fetchData()
function process(item: any) { }

// ✅ 필수
interface LearningItem {
  id: string
  title: string
  category: 'React Native' | 'Expo' | 'TypeScript'
  status: 'todo' | 'in_progress' | 'done'
  date: string
}

const data: LearningItem[] = fetchData()
function process(item: LearningItem) { }
```

### 3.2 포맷팅 규칙

- **들여쓰기**: 2칸 (스페이스)
- **라인 길이**: 100자 이하 (권장)
- **세미콜론**: 사용 (Prettier 설정)
- **포맷팅**: `npm run format` 실행 필수

### 3.3 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `learningItems`, `fetchNotionData()` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS`, `API_TIMEOUT` |
| 컴포넌트 | PascalCase | `MainNav`, `LearningCard` |
| 파일 (컴포넌트) | PascalCase.tsx | `MainNav.tsx` |
| 파일 (유틸) | kebab-case.ts | `notion-client.ts` |
| 타입/Interface | PascalCase | `LearningItem`, `NotionResponse` |

### 3.4 코드 작성 스타일

**Server vs Client Components**:
- 기본값: Server Component (데이터 패칭 최적화)
- Client Component 필수 조건: 상태, 이벤트 리스너, 훅 필요할 때만

```typescript
// ✅ Server Component (기본값)
export default async function DashboardPage() {
  const data = await fetchLearningData()
  return <Dashboard data={data} />
}

// ✅ Client Component (상태 필요시만)
'use client'
export function DashboardFilters({ onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  // 필터링 로직
}
```

**Error Handling**:
- 모든 async 작업에 try-catch 또는 error boundary 필수
- API 호출 실패 시 사용자 친화적 에러 메시지 표시
- 에러 로깅 (Phase 5에서 구현)

```typescript
// ✅ 필수
async function fetchData() {
  try {
    const response = await notionService.fetchLearningItems()
    return response
  } catch (error) {
    console.error('Failed to fetch learning data:', error)
    throw new Error('학습 데이터를 불러올 수 없습니다.')
  }
}
```

---

## 4. 기능 구현 표준

### 4.1 페이지 개발 플로우

1. **페이지 생성**: `src/app/[page-name]/page.tsx`
2. **레이아웃** (필요시): `src/app/[page-name]/layout.tsx`
3. **컴포넌트 분리**: 각 기능별로 `src/components/[feature]/` 디렉토리 생성
4. **타입 정의**: `src/types/[feature].ts`에 타입 추가
5. **테스트**: `npm run check-all` 통과 확인

### 4.2 Notion 데이터 연동

**데이터 흐름**:
```
Notion Database
    ↓
Notion API Client (src/lib/notion-client.ts)
    ↓
Service Layer (src/services/notion-service.ts)
    ↓
Server Actions / API Routes
    ↓
React Components
```

**캐싱 전략**:
- Notion API 응답 캐싱: 5분 단위 ISR 설정 (Phase 2)
- 레이트 제한 대응: 배치 요청, 재시도 로직 구현

### 4.3 UI 컴포넌트 개발

**shadcn/ui 사용**:
- 기본 컴포넌트: `src/components/ui/` (shadcn 설치)
- 커스터마이징: Tailwind CSS로 스타일 확장
- 추가 필요 시: `npx shadcn@latest add [component-name]`

**컴포넌트 구조**:
```typescript
// ✅ 단일 책임 원칙
interface LearningCardProps {
  item: LearningItem
  onClick?: () => void
}

export function LearningCard({ item, onClick }: LearningCardProps) {
  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>{item.summary}</CardContent>
    </Card>
  )
}
```

### 4.4 폼 처리

**필수 라이브러리**: React Hook Form + Zod

```typescript
// ✅ 폼 검증
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 폼 필드 */}
    </form>
  )
}
```

---

## 5. 프레임워크/라이브러리 사용 표준

### 5.1 Next.js 15.5.3 (App Router)

**필수 규칙**:
- App Router 사용 (Pages Router 금지)
- Server Components 기본값
- async/await 문법으로 데이터 패칭
- Next.js 15.5.3 새로운 async request APIs 사용

```typescript
// ✅ 필수: async request APIs (Next.js 15.5.3)
import { cookies, headers } from 'next/headers'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params  // 필수: await 사용
  const query = await searchParams
  const cookieStore = await cookies()

  return <PageContent />
}
```

### 5.2 React 19

**최신 기능 활용**:
- 컴포넌트 state: `useState` (Client Component에서만)
- 부수 효과: `useEffect` (필요시에만)
- 서버 상태: Server Components + 서버 함수

### 5.3 Tailwind CSS v4

**사용 규칙**:
- 유틸리티 우선 접근 (Utility-first)
- `cn()` 함수로 클래스 병합 (from `lib/utils.ts`)
- 응답형 설계 필수: `sm:`, `md:`, `lg:` 등

```typescript
// ✅ Tailwind CSS 사용
<div className={cn(
  'rounded-lg border bg-card p-6',
  'hover:shadow-lg transition-shadow',
  'sm:p-4 md:p-8'
)}>
  {children}
</div>
```

### 5.4 shadcn/ui

**사용 규칙**:
- 설치된 컴포넌트만 사용 (`src/components/ui/`)
- Tailwind CSS로 커스터마이징
- 접근성(a11y) 준수 (ARIA 레이블 등)

**설치 방법**:
```bash
npx shadcn@latest add [component-name]
```

### 5.5 React Hook Form + Zod

**폼 개발 표준**:
- 모든 폼에 Zod 스키마 정의
- 클라이언트 + 서버 검증
- 에러 메시지 사용자 친화적 표현

---

## 6. 워크플로우 표준

### 6.1 개발 체크리스트

모든 작업 완료 후 다음 명령어 실행:

```bash
# 타입 체크
npm run typecheck

# 린팅
npm run lint

# 포맷팅
npm run format:check

# 통합 체크 (권장)
npm run check-all
```

**모두 통과해야 PR 가능**

### 6.2 Git 커밋 메시지

```
[Phase N] 기능명: 간단한 설명

상세 설명 (필요시)
- 변경 사항 1
- 변경 사항 2
```

예시:
```
[Phase 2] Notion API: 학습 데이터 패칭 로직 구현

- NotionClient 클래스 작성
- 데이터 캐싱 로직 추가
- 에러 핸들링 구현
```

### 6.3 개발 순서 (Phase별)

**Phase 1** (현재): 프로젝트 골격
- ✅ 디렉토리 구조
- ✅ Tailwind CSS & shadcn/ui
- ✅ 레이아웃 & 네비게이션
- ✅ 타입 정의

**Phase 2**: 공통 모듈
- Notion API 클라이언트
- 데이터 모델 & 타입
- 서비스 레이어

**Phase 3**: 핵심 기능
- 홈 대시보드
- 로드맵 페이지

**Phase 4**: 추가 기능
- 상세 페이지
- 마크다운 렌더링

**Phase 5**: 최적화 & 배포
- 성능 최적화
- SEO 설정
- 배포

---

## 7. 핵심 파일 상호작용 표준

### 7.1 수정 시 동시 변경 필요 파일

| 변경 대상 | 동시 수정 필요 파일 | 이유 |
|----------|------------------|------|
| 새 페이지 추가 | `src/app/[page]/page.tsx` | 라우팅 자동 생성 |
| 전역 스타일 | `src/app/globals.css` | 모든 페이지 영향 |
| 타입 추가 | `src/types/[feature].ts` | 타입 일관성 |
| 환경 변수 | `src/lib/env.ts` + `.env.local` | 검증 필수 |
| API 클라이언트 | `src/lib/notion-client.ts` + `src/services/notion-service.ts` | 데이터 흐름 일관성 |

### 7.2 문서와 코드 동기화

**수정 시 문서 업데이트**:
- 새 기능 추가: `docs/PRD.md` 업데이트
- 개발 진행: `docs/ROADMAP.md` 상태 업데이트
- 구조 변경: `docs/guides/project-structure.md` 업데이트

---

## 8. AI 의사결정 표준

### 8.1 파일 생성 판단

**새 파일 생성 필요**:
- ✅ 새로운 페이지 (src/app 하위)
- ✅ 새로운 컴포넌트 (로직 재사용)
- ✅ 새로운 서비스 (API 연동)

**기존 파일 수정 우선**:
- ❌ 중복 코드 작성 (기존 파일 리팩토링)
- ❌ 유틸 함수 추가 (lib/utils.ts 활용)

### 8.2 컴포넌트 분리 판단

**분리 필요** (새 파일):
- 3개 이상의 다른 페이지에서 재사용
- 200줄 이상의 코드
- 명확하게 분리된 기능/책임

**분리 불필요** (같은 파일):
- 한 페이지에서만 사용
- 100줄 이하
- 강하게 결합된 로직

### 8.3 캐싱/성능 판단

**캐싱 필수**:
- Notion API 호출 (5분 ISR 또는 revalidateTag)
- 정적 생성 가능한 페이지 (SSG)

**캐싱 불필요**:
- 사용자 특화 데이터
- 실시간 업데이트 필요 데이터

### 8.4 상태 관리 판단

**Server State** (기본값):
- 데이터베이스/API 데이터
- Server Components에서 처리

**Client State** (필요시):
- UI 상태 (모달 열림/닫힘, 탭 선택 등)
- 폼 입력값
- 임시 데이터

---

## 9. 금지된 행동 (엄격 금지)

### 9.1 코드 작성

- ❌ **any 타입 사용**: 모든 타입 명시적 정의
- ❌ **console.log 남기기**: 배포 전 제거 (디버깅 후)
- ❌ **주석 없는 복잡한 로직**: 자명하지 않으면 주석 필수
- ❌ **하드코딩된 값**: 상수 또는 환경 변수로 관리
- ❌ **패턴 매칭 없는 에러 처리**: 구체적인 에러 타입 처리

### 9.2 파일 구조

- ❌ **Pages Router 사용**: App Router만 사용
- ❌ **src/ 밖에 컴포넌트 생성**: 엄격히 금지
- ❌ **평탄한 컴포넌트 구조**: 기능별 디렉토리 분류 필수
- ❌ **index.ts로 자동 export**: 명시적 import 경로

### 9.3 성능/보안

- ❌ **클라이언트에서 API 키 노출**: .env.local만 사용
- ❌ **Notion API 키 하드코딩**: 환경 변수로 관리
- ❌ **무제한 데이터 페칭**: 페이지네이션/제한 구현
- ❌ **레이트 제한 무시**: Notion API 제한 준수

### 9.4 테스트/배포

- ❌ **npm run check-all 실패 상태 커밋**: 모든 검사 통과 필수
- ❌ **미문서화된 기능**: 변경사항 문서에 기록
- ❌ **Phase 순서 무시**: 명시된 순서 준수

### 9.5 Notion API 사용

- ❌ **동기식 블로킹 호출**: async/await 필수
- ❌ **캐시 없는 반복 요청**: 캐싱/ISR 구현
- ❌ **에러 무시**: 재시도 로직 + 사용자 알림
- ❌ **Rate Limiting 대응 없음**: 배치 처리/큐 구현

---

## 10. 참조 문서

### 필수 참조:
- 📋 **PRD**: `docs/PRD.md` - 기능 명세
- 🗺️ **ROADMAP**: `docs/ROADMAP.md` - Phase별 작업
- 📁 **프로젝트 구조**: `docs/guides/project-structure.md`
- 🧩 **컴포넌트 패턴**: `docs/guides/component-patterns.md`
- 🎨 **스타일 가이드**: `docs/guides/styling-guide.md`
- ⚡ **Next.js 15.5.3**: `docs/guides/nextjs-15.md`
- 📝 **폼 처리**: `docs/guides/forms-react-hook-form.md`
- 🤖 **이 파일**: `shrimp-rules.md` (AI 지침)

### 외부 문서:
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Notion API 공식 문서](https://developers.notion.com)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [React Hook Form 문서](https://react-hook-form.com)

---

**작성일**: 2026-04-01
**버전**: 1.0
**상태**: 초안 완료

