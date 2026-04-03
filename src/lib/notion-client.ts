import { Client } from '@notionhq/client'
import { env } from './env'
import { NotionError } from './errors'

// ============================================================================
// Notion 클라이언트 싱글톤
// ============================================================================

let notionClientInstance: Client | null = null

/**
 * Notion 클라이언트 인스턴스를 반환합니다.
 * 싱글톤 패턴으로 단일 인스턴스를 재사용합니다.
 * 서버 사이드에서만 호출해야 합니다.
 */
export function getNotionClient(): Client {
  // 이미 생성된 인스턴스가 있으면 재사용
  if (notionClientInstance) {
    return notionClientInstance
  }

  // 환경 변수에서 API 키 읽기
  const apiKey = env.NOTION_API_KEY

  if (!apiKey) {
    throw new NotionError(
      'NOTION_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    )
  }

  // Notion 클라이언트 초기화
  notionClientInstance = new Client({
    auth: apiKey,
  })

  return notionClientInstance
}

/**
 * 테스트 및 개발 환경에서 클라이언트 인스턴스를 초기화합니다.
 * 단위 테스트에서 모킹 목적으로 사용합니다.
 */
export function resetNotionClient(): void {
  notionClientInstance = null
}
