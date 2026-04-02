# 📋 DevPath - 제품 요구사항 문서 (PRD)

## 1. 프로젝트 개요

### 프로젝트명

**DevPath** - 학습 로드맵 & 데브로그 웹사이트

### 목적

Notion API를 CMS로 활용하여 React Native, Expo 등 새로운 기술 스택 학습 기록과 진척도를 시각화하고 공유하는 웹 대시보드 구축

### CMS 선택 이유

- Notion API를 활용하여 비개발자도 손쉽게 학습 콘텐츠와 로드맵 관리 가능
- 마크다운 기반 콘텐츠 작성으로 개발 부담 최소화
- 구조화된 데이터베이스로 메타데이터(상태, 카테고리, 날짜 등) 관리 효율화

---

## 2. 핵심 기능

### 2.1 학습 타임라인 시각화

- Notion 데이터베이스에서 학습 주제 데이터를 동기화
- 기술 스택(React Native, Expo, Zustand 등)의 로드맵을 타임라인으로 표시
- 시간 순서대로 정렬된 학습 진행 과정 시각화

### 2.2 진척도 트래킹 대시보드

- Notion Status 필드(시작 전, 진행 중, 완료)를 기반으로 진척도 계산
- 기술 스택별 달성률을 프로그레스 바로 표시
- 카테고리별 필터링을 통한 선택적 진행률 조회

### 2.3 마크다운 기반 데브로그 뷰어

- Notion에 작성된 Rich Text 콘텐츠를 마크다운으로 렌더링
- 코드 블록, 트러블슈팅 기록, 학습 노트를 웹 화면에 깔끔하게 표시
- 개별 학습 항목의 상세 내용 제공

### 2.4 상태별 필터링

- To Do, In Progress, Done 상태로 학습 항목 필터링
- 카테고리(React Native, TypeScript, Dart/Flutter 등)별 필터링
- 필터 조합을 통한 맞춤형 조회

---

## 3. 기술 스택

| 영역                   | 기술                       |
| ---------------------- | -------------------------- |
| **Framework**          | Next.js 15.5.3             |
| **Language**           | TypeScript 5               |
| **Frontend Rendering** | React 19                   |
| **Styling**            | Tailwind CSS v4            |
| **Component Library**  | shadcn/ui (new-york style) |
| **Icons**              | Lucide React               |
| **CMS**                | Notion API                 |
| **Forms**              | React Hook Form + Zod      |
| **Server Actions**     | Next.js Server Actions     |

---

## 4. Notion 데이터베이스 스키마

### 4.1 메인 학습 데이터베이스

| 필드명       | 타입         | 설명                      | 예시                                                 |
| ------------ | ------------ | ------------------------- | ---------------------------------------------------- |
| **Title**    | Title        | 학습 주제                 | "Expo Router 파일 기반 라우팅"                       |
| **Category** | Select       | 기술 카테고리             | React Native, Expo, Expo Router, TypeScript, Zustand |
| **Status**   | Status       | 학습 상태                 | 시작 전, 진행 중, 완료                               |
| **Date**     | Date         | 학습 진행 날짜 또는 기간  | 2026-03-15 ~ 2026-03-31                              |
| **Summary**  | Rich Text    | 짧은 요약 (대시보드 노출) | "Expo 라우터의 파일 기반 라우팅 구조 학습..."        |
| **Content**  | Rich Text    | 상세 학습 내용 (마크다운) | 코드 블록, 노트, 링크 등                             |
| **Tags**     | Multi-select | 추가 태그                 | React, Navigation, Best Practices                    |

---

## 5. 화면 구성 (UI/UX)

### 5.1 홈 대시보드 (Home)

**경로**: `/`

**구성 요소**:

- 전체 학습 진행률 요약 (원형 차트 또는 프로그레스 바)
- 카테고리별 진행률 카드
- 상태별 필터링 버튼 (To Do, In Progress, Done)
- 최근 학습 리스트 (10개 이하, 최신순)
  - 학습 주제명
  - 카테고리 태그
  - 상태 뱃지
  - 진행 날짜
  - 요약 텍스트

### 5.2 로드맵 페이지 (Roadmap)

**경로**: `/roadmap`

**구성 요소**:

- 기술 스택별 탭 또는 드롭다운 (Expo, TypeScript, React Native 등)
- 선택된 카테고리에 해당하는 타임라인 뷰
  - 수평 또는 수직 타임라인 레이아웃
  - 각 학습 항목을 타임라인 노드로 표시
  - 상태별 색상 구분 (진행 중: 파란색, 완료: 초록색, 미시작: 회색)
  - 클릭 시 상세 페이지로 이동

### 5.3 상세 페이지 (Detail)

**경로**: `/detail/[id]`

**구성 요소**:

- 학습 주제명 및 메타정보 (카테고리, 상태, 날짜)
- 마크다운 렌더링 뷰어
  - 코드 블록 문법 하이라이팅
  - 이미지 삽입 지원
  - 링크 및 임베드 지원
- 관련 학습 항목 추천 (같은 카테고리)
- 이전/다음 학습 항목 네비게이션

---

## 6. MVP (Minimum Viable Product) 범위

### 6.1 필수 구현 기능

#### Phase 1: 데이터 연동 (1주)

- [ ] Notion API 클라이언트 라이브러리 설정
- [ ] Notion 데이터베이스 인증 및 연동
- [ ] DB Fetching 로직 구현 (캐싱 포함)
- [ ] 데이터 모델 정의 (TypeScript DTO)

#### Phase 2: 홈 대시보드 UI (1주)

- [ ] 홈 페이지 레이아웃 구성
- [ ] 전체 진행률 계산 및 표시
- [ ] 학습 리스트 컴포넌트 구현
- [ ] 상태별 필터링 UI (버튼/탭)
- [ ] 카테고리 필터링 UI

#### Phase 3: 로드맵 페이지 (1주)

- [ ] 로드맵 페이지 레이아웃
- [ ] 카테고리별 데이터 필터링
- [ ] 타임라인 뷰 컴포넌트 (수평/수직)
- [ ] 상태별 색상 스타일링

#### Phase 4: 상세 페이지 (1주)

- [ ] 상세 페이지 레이아웃
- [ ] 마크다운 렌더러 (Notion Rich Text → HTML)
- [ ] 코드 블록 문법 하이라이팅
- [ ] 메타정보 표시 및 네비게이션

#### Phase 5: 성능 최적화 & 배포 (1주)

- [ ] Next.js 정적 생성 (SSG) 또는 증분 정적 재생성 (ISR) 설정
- [ ] 이미지 최적화
- [ ] SEO 메타 태그 설정
- [ ] Vercel 배포 및 환경 변수 설정

### 6.2 제외 기능 (향후 업데이트)

- 사용자 인증 및 댓글 기능
- 학습 통계 대시보드 (고급 분석)
- 다크 모드
- 모바일 앱 (React Native)

---

## 7. 데이터 흐름

```
Notion Database
       ↓
Notion API Client
       ↓
Server-side Fetching (Next.js API Route / Server Action)
       ↓
Caching Layer (Redis / ISR)
       ↓
React Components
       ↓
Browser Rendering
```

---

## 8. 성공 기준

### 8.1 기능 성공 기준

- ✅ Notion API 연동 성공 (모든 필드 정상 동기화)
- ✅ 홈 대시보드에서 진행률이 정확하게 계산되고 표시됨
- ✅ 필터링 기능이 정상 작동 (상태, 카테고리)
- ✅ 로드맵 타임라인이 시간 순서대로 정렬되어 표시됨
- ✅ 상세 페이지에서 마크다운 및 코드 블록이 올바르게 렌더링됨

### 8.2 성능 성공 기준

- ⚡ 홈 페이지 초기 로딩: 2초 이내
- ⚡ 로드맵 페이지 로딩: 1.5초 이내
- ⚡ Notion API 요청 캐싱: 5분 단위 갱신

### 8.3 UX 성공 기준

- 🎨 Tailwind CSS + shadcn/ui로 일관된 디자인
- 🎨 모바일 반응형 레이아웃 (모바일, 태블릿, 데스크톱)
- 🎨 접근성(a11y) 준수 (ARIA 레이블, 키보드 네비게이션)

---

## 9. 제약사항 및 위험 요소

### 9.1 제약사항

- Notion API 레이트 제한 (분당 3회)
- Notion Rich Text 렌더링 복잡도 (다양한 포맷 지원)
- 이미지 호스팅 전략 필요 (Notion 외부 저장소)

### 9.2 위험 요소

- Notion API 변경 또는 중단 (버전 관리 필요)
- 대규모 데이터베이스의 경우 Fetching 성능 저하
- 마크다운 렌더링 라이브러리 의존성 관리

---

## 10. 개발 환경 설정

### 10.1 필수 환경

- Node.js 20 이상
- npm 또는 yarn
- Notion 계정 및 API 키

### 10.2 개발 서버 실행

```bash
npm run dev
```

### 10.3 빌드 및 배포

```bash
npm run build
npm run start
```

---

## 11. 문서 참조

- 📁 프로젝트 구조: `@/docs/guides/project-structure.md`
- 🎨 스타일링 가이드: `@/docs/guides/styling-guide.md`
- 🧩 컴포넌트 패턴: `@/docs/guides/component-patterns.md`
- ⚡ Next.js 15 가이드: `@/docs/guides/nextjs-15.md`
- 📝 폼 처리 가이드: `@/docs/guides/forms-react-hook-form.md`
- 🗺️ 개발 로드맵: `@/docs/ROADMAP.md`

---

**문서 작성일**: 2026-03-31  
**버전**: 1.0  
**상태**: 초안 완료
