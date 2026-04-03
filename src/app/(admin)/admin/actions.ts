'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { LearningItemInput } from '@/types'
import {
  verifyAdminPassword,
  createAdminSession,
  clearAdminSession,
} from '@/lib/auth'
import {
  createLearningItem,
  updateLearningItem,
  deleteLearningItem,
} from '@/services/learning-service'
import { ValidationError } from '@/lib/errors'

// ============================================================================
// 인증 관련 액션
// ============================================================================

/**
 * 관리자 로그인 처리
 */
export async function loginAdmin(password: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    if (!password || password.trim().length === 0) {
      return {
        success: false,
        error: '패스워드를 입력해주세요.',
      }
    }

    if (!verifyAdminPassword(password)) {
      return {
        success: false,
        error: '패스워드가 올바르지 않습니다.',
      }
    }

    await createAdminSession()
    return { success: true }
  } catch (error) {
    console.error('[loginAdmin] Error:', error)
    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 관리자 로그아웃 처리
 */
export async function logoutAdmin() {
  await clearAdminSession()
  redirect('/admin/login')
}

// ============================================================================
// 학습 항목 CRUD 액션
// ============================================================================

/**
 * 새 학습 항목을 생성합니다.
 */
export async function createItemAction(input: LearningItemInput): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // 입력값 검증
    if (!input.title || input.title.trim().length === 0) {
      return { success: false, error: '제목을 입력해주세요.' }
    }
    if (!input.summary || input.summary.trim().length === 0) {
      return { success: false, error: '요약을 입력해주세요.' }
    }
    if (!input.content || input.content.trim().length === 0) {
      return { success: false, error: '내용을 입력해주세요.' }
    }

    await createLearningItem(input)
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('[createItemAction] Error:', error)
    if (error instanceof ValidationError) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: '학습 항목 생성 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 기존 학습 항목을 수정합니다.
 */
export async function updateItemAction(
  id: string,
  input: Partial<LearningItemInput>
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    if (!id) {
      return { success: false, error: '항목 ID가 없습니다.' }
    }

    await updateLearningItem(id, input)
    revalidatePath('/admin')
    revalidatePath(`/learning/${id}`)
    return { success: true }
  } catch (error) {
    console.error('[updateItemAction] Error:', error)
    if (error instanceof ValidationError) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: '학습 항목 수정 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 학습 항목을 삭제합니다.
 */
export async function deleteItemAction(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    if (!id) {
      return { success: false, error: '항목 ID가 없습니다.' }
    }

    await deleteLearningItem(id)
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('[deleteItemAction] Error:', error)
    if (error instanceof ValidationError) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: '학습 항목 삭제 중 오류가 발생했습니다.',
    }
  }
}
