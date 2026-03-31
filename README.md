# DevPath - 학습 로드맵 & 데브로그

Notion API를 CMS로 활용하여 기술 스택 학습 기록과 진척도를 시각화하는 웹 대시보드입니다.

## 주요 기능

- **학습 타임라인 시각화**: React Native, Expo, TypeScript 등 기술 스택별 로드맵 제공
- **진척도 트래킹 대시보드**: 상태(시작 전, 진행 중, 완료)별 달성률을 프로그레스 바로 표시
- **마크다운 기반 데브로그 뷰어**: Notion에 작성된 코드 블록, 트러블슈팅 기록을 웹에서 렌더링

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15.5.3 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| CMS | Notion API |
| Icons | Lucide React |

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 Notion API 정보를 입력하세요:

```bash
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 화면 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 대시보드 - 전체 진행률 및 학습 리스트 |
| `/roadmap` | 카테고리별 타임라인 뷰 |
| `/detail/[id]` | 개별 학습 내용 상세 페이지 |

## Notion 데이터베이스 스키마

| 필드 | 타입 | 설명 |
|------|------|------|
| Title | Title | 학습 주제 |
| Category | Select | React Native, Expo, TypeScript 등 |
| Status | Status | 시작 전 / 진행 중 / 완료 |
| Date | Date | 학습 날짜 또는 기간 |
| Summary | Rich Text | 대시보드 노출용 요약 |
| Content | Rich Text | 상세 학습 내용 |

## 빌드

```bash
npm run build
```

## 문서

- [PRD (제품 요구사항)](./docs/PRD.md)
- [프로젝트 구조](./docs/guides/project-structure.md)
- [스타일링 가이드](./docs/guides/styling-guide.md)
- [컴포넌트 패턴](./docs/guides/component-patterns.md)
