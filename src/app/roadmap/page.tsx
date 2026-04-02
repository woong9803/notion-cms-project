// 로드맵 페이지 - 카테고리별 학습 타임라인 시각화
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { RoadmapContainer } from '@/components/roadmap/roadmap-container'
import { Badge } from '@/components/ui/badge'
import { Map } from 'lucide-react'
import type { LearningItem, CategoryProgress } from '@/types'

// ============================================================================
// 목 데이터 - 실제 구현 시 서비스 레이어에서 데이터 주입 필요
// ============================================================================

/**
 * 로드맵 페이지 목 데이터 (시간순 정렬)
 * TODO: 실제 Notion API 데이터로 교체 필요
 */
const mockRoadmapItems: LearningItem[] = [
  {
    id: '1',
    title: 'TypeScript 기초 문법',
    category: 'typescript',
    status: 'done',
    summary: '타입 시스템, 인터페이스, 제네릭 기본 개념 학습',
    content: '',
    tags: ['typescript', 'basics'],
    startDate: new Date('2026-01-05'),
    endDate: new Date('2026-01-12'),
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-12'),
  },
  {
    id: '2',
    title: 'React Native 환경 설정',
    category: 'react_native',
    status: 'done',
    summary: 'React Native CLI, Expo 환경 구성 및 첫 앱 실행',
    content: '',
    tags: ['setup', 'environment'],
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-01-20'),
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '3',
    title: 'Expo SDK 핵심 API',
    category: 'expo',
    status: 'done',
    summary: 'Expo SDK의 카메라, 위치, 알림 API 활용',
    content: '',
    tags: ['expo', 'sdk', 'api'],
    startDate: new Date('2026-01-22'),
    endDate: new Date('2026-02-02'),
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-02-02'),
  },
  {
    id: '4',
    title: 'React Native 컴포넌트 심화',
    category: 'react_native',
    status: 'done',
    summary: 'FlatList, SectionList, ScrollView 최적화',
    content: '',
    tags: ['components', 'flatlist', 'optimization'],
    startDate: new Date('2026-02-05'),
    endDate: new Date('2026-02-15'),
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: '5',
    title: 'Expo Router 기초',
    category: 'expo_router',
    status: 'done',
    summary: '파일 기반 라우팅, 레이아웃 그룹, 탭 네비게이션',
    content: '',
    tags: ['expo-router', 'navigation', 'tabs'],
    startDate: new Date('2026-02-18'),
    endDate: new Date('2026-02-28'),
    createdAt: new Date('2026-02-18'),
    updatedAt: new Date('2026-02-28'),
  },
  {
    id: '6',
    title: 'TypeScript 제네릭 심화',
    category: 'typescript',
    status: 'in_progress',
    summary: '제네릭 타입, 조건부 타입, infer 키워드 활용',
    content: '',
    tags: ['generic', 'conditional-types'],
    startDate: new Date('2026-03-05'),
    createdAt: new Date('2026-03-05'),
    updatedAt: new Date('2026-04-02'),
  },
  {
    id: '7',
    title: 'Expo Router v3 고급 기능',
    category: 'expo_router',
    status: 'in_progress',
    summary: '동적 라우트, API Routes, Server Components 활용',
    content: '',
    tags: ['expo-router', 'dynamic-routes', 'server'],
    startDate: new Date('2026-03-15'),
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-04-02'),
  },
  {
    id: '8',
    title: 'React Native 애니메이션',
    category: 'react_native',
    status: 'in_progress',
    summary: 'Animated API, Reanimated 3, Gesture Handler 통합',
    content: '',
    tags: ['animation', 'reanimated', 'gesture'],
    startDate: new Date('2026-03-20'),
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-04-02'),
  },
  {
    id: '9',
    title: 'Zustand 상태 관리',
    category: 'zustand',
    status: 'todo',
    summary: 'Store 설계, 미들웨어, devtools, persist 플러그인',
    content: '',
    tags: ['zustand', 'state', 'store'],
    createdAt: new Date('2026-04-02'),
    updatedAt: new Date('2026-04-02'),
  },
  {
    id: '10',
    title: 'Expo + TypeScript 고급 패턴',
    category: 'expo',
    status: 'todo',
    summary: 'Expo + TypeScript 타입 안전한 앱 구조 설계',
    content: '',
    tags: ['expo', 'typescript', 'architecture'],
    createdAt: new Date('2026-04-05'),
    updatedAt: new Date('2026-04-05'),
  },
]

/**
 * 카테고리별 항목 수 계산 (탭 배지용)
 * TODO: 실제 데이터에서 계산하도록 교체 필요
 */
const mockCategoryCounts: Partial<
  Record<'all' | CategoryProgress['category'], number>
> = {
  all: mockRoadmapItems.length,
  react_native: mockRoadmapItems.filter(i => i.category === 'react_native')
    .length,
  expo: mockRoadmapItems.filter(i => i.category === 'expo').length,
  expo_router: mockRoadmapItems.filter(i => i.category === 'expo_router')
    .length,
  typescript: mockRoadmapItems.filter(i => i.category === 'typescript').length,
  zustand: mockRoadmapItems.filter(i => i.category === 'zustand').length,
  other: mockRoadmapItems.filter(i => i.category === 'other').length,
}

/**
 * 로드맵 페이지 (서버 컴포넌트)
 * - 카테고리 탭으로 기술 스택별 학습 타임라인 조회
 * - 상태 필터링으로 완료/진행중/시작전 항목 구분
 * - 수직 타임라인으로 학습 여정 시각화
 *
 * TODO: 실제 Notion API 데이터 주입
 * - LearningService.getAllItems() 호출
 * - 정렬 및 필터링 서버 처리
 * - Suspense + loading.tsx 활용
 */
export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <div className="py-6 sm:py-8 lg:py-10">
            {/* ====== 페이지 헤더 ====== */}
            <div className="mb-8 flex flex-col gap-3">
              {/* 페이지 배지 */}
              <Badge
                variant="secondary"
                className="flex w-fit items-center gap-1.5 text-xs"
              >
                <Map className="h-3 w-3" aria-hidden="true" />
                로드맵
              </Badge>

              {/* 페이지 제목 */}
              <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                학습 로드맵
              </h1>

              {/* 페이지 설명 */}
              <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
                기술 스택별 학습 타임라인과 진행 상황을 확인하세요.
                <br className="hidden sm:block" />
                카테고리 탭을 선택하거나 상태로 필터링하여 원하는 항목을
                찾아보세요.
              </p>
            </div>

            {/* ====== 로드맵 인터랙션 컨테이너 (Task 205, 206, 207) ====== */}
            <RoadmapContainer
              items={mockRoadmapItems}
              activeCategory="all"
              selectedStatuses={[]}
              categoryCounts={mockCategoryCounts}
              isLoading={false}
              // TODO: 실제 데이터 및 상태 연결 필요
            />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
