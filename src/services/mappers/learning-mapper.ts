import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { LearningItem, LearningItemInput } from '@/types'
import type {
  NotionLearningPageDTO,
  LearningPagePropertiesDTO,
  TitlePropertyDTO,
  SelectPropertyDTO,
  StatusPropertyDTO,
  DatePropertyDTO,
  RichTextPropertyDTO,
  MultiSelectPropertyDTO,
} from '@/services/dtos/notion-dtos'
import {
  convertNotionStatusToApp,
  convertNotionCategoryToApp,
} from '@/lib/validators'
import { APP_TO_NOTION_STATUS, APP_TO_NOTION_CATEGORY } from '@/lib/constants'
import { ValidationError } from '@/lib/errors'

// ============================================================================
// 속성 추출 헬퍼 함수
// ============================================================================

/**
 * Notion 페이지의 raw properties를 LearningPagePropertiesDTO로 안전하게 변환합니다.
 * 필수 컬럼이 없으면 ValidationError를 throw합니다.
 */
function extractProperties(
  raw: PageObjectResponse['properties']
): LearningPagePropertiesDTO {
  const 제목 = raw['Title']
  const 카테고리 = raw['Category']
  const 상태 = raw['Status']
  const 날짜 = raw['Date']
  const 요약 = raw['Summary']
  const 내용 = raw['Content']
  const 태그 = raw['Tags']

  if (!제목 || 제목.type !== 'title') {
    throw new ValidationError(
      'Notion 페이지에 "Title" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }
  if (!카테고리 || 카테고리.type !== 'select') {
    throw new ValidationError(
      'Notion 페이지에 "Category" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }
  if (!상태 || 상태.type !== 'status') {
    throw new ValidationError(
      'Notion 페이지에 "Status" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }
  if (!날짜 || 날짜.type !== 'date') {
    throw new ValidationError(
      'Notion 페이지에 "Date" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }
  if (!요약 || 요약.type !== 'rich_text') {
    throw new ValidationError(
      'Notion 페이지에 "Summary" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }
  if (!내용 || 내용.type !== 'rich_text') {
    throw new ValidationError(
      'Notion 페이지에 "Content" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }
  if (!태그 || 태그.type !== 'multi_select') {
    throw new ValidationError(
      'Notion 페이지에 "Tags" 속성이 없거나 형식이 올바르지 않습니다.'
    )
  }

  return {
    Title: 제목 as TitlePropertyDTO,
    Category: 카테고리 as SelectPropertyDTO,
    Status: 상태 as StatusPropertyDTO,
    Date: 날짜 as DatePropertyDTO,
    Summary: 요약 as RichTextPropertyDTO,
    Content: 내용 as RichTextPropertyDTO,
    Tags: 태그 as MultiSelectPropertyDTO,
  }
}

/**
 * title 속성에서 plain_text를 추출합니다.
 */
function extractTitle(prop: TitlePropertyDTO): string {
  return (
    prop.title
      .map(t => t.plain_text)
      .join('')
      .trim() || '제목 없음'
  )
}

/**
 * rich_text 속성에서 plain_text를 추출합니다.
 */
function extractRichText(prop: RichTextPropertyDTO): string {
  return prop.rich_text
    .map(t => t.plain_text)
    .join('')
    .trim()
}

/**
 * multi_select 속성에서 이름 배열을 추출합니다.
 */
function extractMultiSelect(prop: MultiSelectPropertyDTO): string[] {
  return prop.multi_select.map(item => item.name)
}

// ============================================================================
// PageObjectResponse → NotionLearningPageDTO 변환
// ============================================================================

/**
 * Notion SDK의 PageObjectResponse를 NotionLearningPageDTO로 변환합니다.
 */
export function mapPageResponseToDTO(
  page: PageObjectResponse
): NotionLearningPageDTO {
  const properties = extractProperties(page.properties)

  return {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    properties,
  }
}

// ============================================================================
// NotionLearningPageDTO → LearningItem 변환 (핵심 매퍼)
// ============================================================================

/**
 * NotionLearningPageDTO를 LearningItem으로 변환합니다.
 * 변환 중 오류 발생 시 ValidationError를 throw합니다.
 */
export function mapDTOToLearningItem(dto: NotionLearningPageDTO): LearningItem {
  const { properties } = dto

  // 제목
  const title = extractTitle(properties.Title)

  // 카테고리 (알 수 없는 값은 'other'로 처리)
  const category = convertNotionCategoryToApp(
    properties.Category.select?.name ?? null
  )

  // 상태 (기본값: 'todo')
  const status = convertNotionStatusToApp(
    properties.Status.status?.name ?? null
  )

  // 날짜
  const dateData = properties.Date.date
  const startDate = dateData?.start ? new Date(dateData.start) : undefined
  const endDate = dateData?.end ? new Date(dateData.end) : undefined

  // 요약 및 내용
  const summary = extractRichText(properties.Summary)
  const content = extractRichText(properties.Content)

  // 태그
  const tags = extractMultiSelect(properties.Tags)

  // 생성/수정 시각
  const createdAt = new Date(dto.created_time)
  const updatedAt = new Date(dto.last_edited_time)

  return {
    id: dto.id,
    title,
    category,
    status,
    startDate,
    endDate,
    summary,
    content,
    tags,
    createdAt,
    updatedAt,
  }
}

// ============================================================================
// PageObjectResponse → LearningItem 직접 변환 (파이프라인 단축)
// ============================================================================

/**
 * Notion SDK PageObjectResponse를 LearningItem으로 직접 변환합니다.
 * 내부적으로 mapPageResponseToDTO → mapDTOToLearningItem 파이프라인을 실행합니다.
 */
export function mapNotionPageToLearningItem(
  page: PageObjectResponse
): LearningItem {
  const dto = mapPageResponseToDTO(page)
  return mapDTOToLearningItem(dto)
}

/**
 * Notion SDK PageObjectResponse 배열을 LearningItem 배열로 변환합니다.
 * 변환에 실패한 항목은 건너뛰고 콘솔에 경고를 출력합니다.
 */
export function mapNotionPagesToLearningItems(
  pages: PageObjectResponse[]
): LearningItem[] {
  const results: LearningItem[] = []

  for (const page of pages) {
    try {
      results.push(mapNotionPageToLearningItem(page))
    } catch (error) {
      // 개별 항목 변환 실패 시 경고만 출력하고 계속 진행
      if (error instanceof ValidationError) {
        console.warn(
          `[LearningMapper] 페이지 변환 실패 (ID: ${page.id}): ${error.message}`
        )
      } else {
        console.warn(
          `[LearningMapper] 예기치 않은 오류로 페이지 건너뜀 (ID: ${page.id})`,
          error
        )
      }
    }
  }

  return results
}

// ============================================================================
// LearningItemInput → Notion properties 변환 (역방향 매퍼)
// ============================================================================

/**
 * LearningItemInput을 Notion API properties 형식으로 변환합니다.
 * 이 함수는 생성(create) 또는 수정(update) 시 사용됩니다.
 */
export function mapLearningItemToProperties(
  input: LearningItemInput
): Record<string, unknown> {
  return {
    Title: {
      title: [
        {
          text: {
            content: input.title,
          },
        },
      ],
    },
    Category: {
      select: {
        name: APP_TO_NOTION_CATEGORY[input.category],
      },
    },
    Status: {
      status: {
        name: APP_TO_NOTION_STATUS[input.status],
      },
    },
    Date: {
      date: {
        start: input.startDate ?? null,
        end: input.endDate ?? null,
      },
    },
    Summary: {
      rich_text: [
        {
          text: {
            content: input.summary,
          },
        },
      ],
    },
    Content: {
      rich_text: [
        {
          text: {
            content: input.content,
          },
        },
      ],
    },
    Tags: {
      multi_select: input.tags.map(tag => ({
        name: tag,
      })),
    },
  }
}
