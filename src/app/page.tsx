// 홈 대시보드 페이지 - 전체 학습 현황 요약
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { OverallProgress } from '@/components/dashboard/overall-progress'
import { HomeClient } from '@/components/dashboard/home-client'
import type { ProgressInfo, CategoryProgress, LearningItem } from '@/types'

// ============================================================================
// 목 데이터 - 실제 구현 시 서비스 레이어에서 데이터 주입 필요
// ============================================================================

/**
 * 전체 진행률 목 데이터
 * TODO: 실제 Notion API 데이터로 교체 필요 (learning-service.ts 연결)
 */
const mockOverallProgress: ProgressInfo = {
  total: 42,
  completed: 18,
  inProgress: 7,
  todo: 17,
  percentage: 43,
}

/**
 * 카테고리별 진행률 목 데이터
 * TODO: 실제 Notion API 데이터로 교체 필요
 */
const mockCategoryProgressList: CategoryProgress[] = [
  {
    category: 'react_native',
    total: 15,
    completed: 8,
    inProgress: 3,
    todo: 4,
    percentage: 53,
  },
  {
    category: 'expo',
    total: 8,
    completed: 4,
    inProgress: 2,
    todo: 2,
    percentage: 50,
  },
  {
    category: 'expo_router',
    total: 6,
    completed: 2,
    inProgress: 1,
    todo: 3,
    percentage: 33,
  },
  {
    category: 'typescript',
    total: 7,
    completed: 3,
    inProgress: 1,
    todo: 3,
    percentage: 43,
  },
  {
    category: 'zustand',
    total: 4,
    completed: 1,
    inProgress: 0,
    todo: 3,
    percentage: 25,
  },
  {
    category: 'other',
    total: 2,
    completed: 0,
    inProgress: 0,
    todo: 2,
    percentage: 0,
  },
]

/**
 * 최근 학습 항목 목 데이터 (최신순 10개)
 * TODO: 실제 Notion API 데이터로 교체 필요
 */
const mockRecentItems: LearningItem[] = [
  {
    id: '1',
    title: 'React Native Navigation 기초',
    category: 'react_native',
    status: 'done',
    summary: 'Stack Navigator, Tab Navigator를 활용한 화면 전환 구현',
    content: '',
    tags: ['navigation', 'stack', 'tab'],
    startDate: new Date('2026-03-20'),
    endDate: new Date('2026-03-25'),
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-25'),
  },
  {
    id: '2',
    title: 'Expo Router v3 파일 기반 라우팅',
    category: 'expo_router',
    status: 'in_progress',
    summary: '파일 시스템 기반 라우팅, 동적 라우트, 레이아웃 설정',
    content: '',
    tags: ['expo-router', 'routing', 'layout'],
    startDate: new Date('2026-03-28'),
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: '3',
    title: 'TypeScript 제네릭 심화',
    category: 'typescript',
    status: 'in_progress',
    summary: '제네릭 타입, 조건부 타입, infer 키워드 활용법',
    content: '',
    tags: ['generic', 'conditional-types', 'infer'],
    startDate: new Date('2026-04-01'),
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-02'),
  },
  {
    id: '4',
    title: 'Expo Camera & Image Picker',
    category: 'expo',
    status: 'done',
    summary: '카메라 권한 처리, 이미지 선택 및 업로드 구현',
    content: '',
    tags: ['camera', 'permissions', 'image-picker'],
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-03-19'),
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-19'),
  },
  {
    id: '5',
    title: 'Zustand 전역 상태 관리 기초',
    category: 'zustand',
    status: 'todo',
    summary: 'Zustand store 설계, 미들웨어, persist 플러그인 활용',
    content: '',
    tags: ['zustand', 'state', 'store'],
    createdAt: new Date('2026-04-02'),
    updatedAt: new Date('2026-04-02'),
  },
]

/**
 * 홈 대시보드 페이지 (서버 컴포넌트)
 * - 학습 현황 전체 요약을 한눈에 확인
 * - DashboardHero: 인사말 + 기술 스택 소개
 * - OverallProgress: 전체 진행률 시각화
 * - CategoryProgressGrid: 카테고리별 진행률 카드
 * - RecentLearningList: 최근 학습 항목 목록
 *
 * TODO: 서버 컴포넌트에서 실제 데이터 패칭으로 교체 필요
 * - LearningService.getOverallProgress() 호출
 * - LearningService.getCategoryProgressList() 호출
 * - LearningService.getRecentItems(10) 호출
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          {/* 페이지 전체 레이아웃 - 섹션 간 간격 */}
          <div className="py-6 sm:py-8 lg:py-10">
            <div className="flex flex-col gap-8 lg:gap-10">
              {/* ====== Task 201: 히어로 섹션 ====== */}
              <DashboardHero
                lastUpdated="2026.04.02"
                // TODO: 실제 마지막 업데이트 날짜로 교체 필요
              />

              {/* ====== Task 202: 전체 진행률 섹션 ====== */}
              <OverallProgress
                progress={mockOverallProgress}
                // TODO: 실제 진행률 데이터 주입 필요
              />

              {/* ====== Task 203, 204: 카테고리 그리드 + 최근 학습 리스트 (Client Component) ====== */}
              {/* 카테고리 클릭, 필터 상태 등 인터랙션이 필요한 영역을 클라이언트 컴포넌트로 분리 */}
              <HomeClient
                categoryProgressList={mockCategoryProgressList}
                recentItems={mockRecentItems}
                // TODO: 실제 데이터 주입 필요
              />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
