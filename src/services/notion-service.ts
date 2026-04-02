import {
  isFullPage,
  isNotionClientError,
  isHTTPResponseError,
} from '@notionhq/client'
import type {
  QueryDataSourceParameters,
  QueryDataSourceResponse,
  GetDatabaseResponse,
  PageObjectResponse,
} from '@notionhq/client'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints/blocks'
import { getNotionClient } from '@/lib/notion-client'
import { NotionError, NotFoundError } from '@/lib/errors'

// ============================================================================
// 내부 헬퍼: Notion 에러를 앱 에러로 변환
// ============================================================================

/**
 * Notion SDK 에러를 NotionError로 변환하고 throw합니다.
 */
function throwNotionError(error: unknown): never {
  if (isHTTPResponseError(error)) {
    // HTTP 응답 에러 (400, 401, 404 등)
    throw new NotionError(
      `Notion API 오류 [HTTP ${error.status}]: ${error.message}`,
      { code: error.code, status: error.status }
    )
  }
  if (isNotionClientError(error)) {
    // 타임아웃, 잘못된 경로 파라미터 등 클라이언트 에러
    throw new NotionError(
      `Notion 클라이언트 오류 [${error.code}]: ${error.message}`,
      { code: error.code }
    )
  }
  if (error instanceof Error) {
    throw new NotionError(error.message)
  }
  throw new NotionError('알 수 없는 Notion API 오류가 발생했습니다.')
}

// ============================================================================
// 쿼리 옵션 타입
// ============================================================================

/**
 * queryDatabaseAll 함수에 전달할 옵션
 * 이 SDK 버전에서는 dataSources.query를 사용합니다.
 */
export interface NotionQueryOptions {
  /** Notion API 필터 객체 */
  filter?: QueryDataSourceParameters['filter']
  /** Notion API 정렬 배열 */
  sorts?: QueryDataSourceParameters['sorts']
  /** 페이지 커서 (페이지네이션) */
  startCursor?: string
  /** 한 번에 가져올 최대 결과 수 (최대 100) */
  pageSize?: number
}

// ============================================================================
// 데이터베이스 관련 함수
// ============================================================================

/**
 * Notion 데이터베이스 메타 정보를 조회합니다.
 */
export async function getDatabase(
  databaseId: string
): Promise<GetDatabaseResponse> {
  const client = getNotionClient()

  try {
    const response = await client.databases.retrieve({
      database_id: databaseId,
    })
    return response
  } catch (error) {
    throwNotionError(error)
  }
}

// ============================================================================
// 데이터 소스(데이터베이스) 쿼리 함수
// ============================================================================
// 이 버전의 @notionhq/client에서는 databases.query 대신
// dataSources.query를 사용합니다.

/**
 * Notion 데이터 소스(데이터베이스)를 단일 페이지 쿼리합니다.
 */
export async function queryDatabase(
  databaseId: string,
  options: NotionQueryOptions = {}
): Promise<QueryDataSourceResponse> {
  const client = getNotionClient()

  try {
    const response = await client.dataSources.query({
      data_source_id: databaseId,
      filter: options.filter,
      sorts: options.sorts,
      start_cursor: options.startCursor,
      page_size: options.pageSize,
    })
    return response
  } catch (error) {
    throwNotionError(error)
  }
}

/**
 * Notion 데이터 소스(데이터베이스)의 모든 항목을 페이지네이션으로 가져옵니다.
 * has_more가 true인 경우 자동으로 다음 페이지를 요청합니다.
 */
export async function queryDatabaseAll(
  databaseId: string,
  options: Omit<NotionQueryOptions, 'startCursor'> = {}
): Promise<PageObjectResponse[]> {
  const client = getNotionClient()
  const results: PageObjectResponse[] = []
  let startCursor: string | undefined = undefined
  let hasMore = true

  try {
    while (hasMore) {
      const response: QueryDataSourceResponse = await client.dataSources.query({
        data_source_id: databaseId,
        filter: options.filter,
        sorts: options.sorts,
        start_cursor: startCursor,
        page_size: options.pageSize ?? 100,
      })

      // 전체 페이지 응답만 수집 (부분 응답 및 DataSource 객체 제외)
      for (const item of response.results) {
        if (isFullPage(item)) {
          results.push(item)
        }
      }

      hasMore = response.has_more
      startCursor = response.next_cursor ?? undefined
    }

    return results
  } catch (error) {
    throwNotionError(error)
  }
}

// ============================================================================
// 페이지 조회 함수
// ============================================================================

/**
 * Notion 페이지 상세 정보를 조회합니다.
 */
export async function getPage(pageId: string): Promise<PageObjectResponse> {
  const client = getNotionClient()

  try {
    const response = await client.pages.retrieve({
      page_id: pageId,
    })

    if (!isFullPage(response)) {
      throw new NotFoundError(`페이지를 찾을 수 없습니다. (ID: ${pageId})`)
    }

    return response
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throwNotionError(error)
  }
}

// ============================================================================
// 블록 콘텐츠 조회 함수
// ============================================================================

/**
 * 페이지의 블록 자식 목록을 모두 조회합니다.
 * 페이지네이션을 자동으로 처리합니다.
 */
export async function getPageBlocks(
  pageId: string
): Promise<BlockObjectResponse[]> {
  const client = getNotionClient()
  const results: BlockObjectResponse[] = []
  let startCursor: string | undefined = undefined
  let hasMore = true

  try {
    while (hasMore) {
      const response = await client.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100,
      })

      for (const block of response.results) {
        // 전체 블록 응답만 수집
        if ('type' in block) {
          results.push(block as BlockObjectResponse)
        }
      }

      hasMore = response.has_more
      startCursor = response.next_cursor ?? undefined
    }

    return results
  } catch (error) {
    throwNotionError(error)
  }
}
