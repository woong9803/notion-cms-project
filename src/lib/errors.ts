import { ApiError } from '@/types'
import { ERROR_MESSAGES } from './constants'

/**
 * 커스텀 API 에러 클래스
 */
export class AppError extends Error {
  public code: string
  public details?: Record<string, unknown>

  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }
}

/**
 * Notion API 에러
 */
export class NotionError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('NOTION_ERROR', message || ERROR_MESSAGES.notionError, details)
    this.name = 'NotionError'
  }
}

/**
 * 데이터 검증 에러
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(
      'VALIDATION_ERROR',
      message || ERROR_MESSAGES.validationError,
      details
    )
    this.name = 'ValidationError'
  }
}

/**
 * 데이터를 찾을 수 없음 에러
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = ERROR_MESSAGES.notFound,
    details?: Record<string, unknown>
  ) {
    super('NOT_FOUND', message, details)
    this.name = 'NotFoundError'
  }
}

/**
 * 네트워크 에러
 */
export class NetworkError extends AppError {
  constructor(
    message: string = ERROR_MESSAGES.networkError,
    details?: Record<string, unknown>
  ) {
    super('NETWORK_ERROR', message, details)
    this.name = 'NetworkError'
  }
}

/**
 * 서버 에러
 */
export class ServerError extends AppError {
  constructor(
    message: string = ERROR_MESSAGES.serverError,
    details?: Record<string, unknown>
  ) {
    super('SERVER_ERROR', message, details)
    this.name = 'ServerError'
  }
}

// ============================================================================
// 에러 핸들링 유틸리티
// ============================================================================

/**
 * 에러 메시지 반환
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return ERROR_MESSAGES.serverError
}

/**
 * Notion 에러 처리
 */
export function handleNotionError(error: unknown): NotionError {
  if (error instanceof NotionError) {
    return error
  }

  const message = getErrorMessage(error)
  return new NotionError(message)
}

/**
 * 에러가 특정 타입인지 확인
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isNotionError(error: unknown): error is NotionError {
  return error instanceof NotionError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError
}

// ============================================================================
// 에러 응답 헬퍼
// ============================================================================

/**
 * 에러 응답 생성
 */
export function createErrorResponse(error: unknown) {
  const appError =
    error instanceof AppError ? error : new ServerError(getErrorMessage(error))

  return {
    success: false,
    error: appError.toApiError(),
  }
}

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(data: T) {
  return {
    success: true,
    data,
  }
}
