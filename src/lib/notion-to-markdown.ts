// Notion 블록 → 마크다운 변환 유틸리티
// BlockObjectResponse 배열을 마크다운 문자열로 변환합니다.

import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints/blocks'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints/common'

// ============================================================================
// Rich Text → 마크다운 인라인 변환
// ============================================================================

/**
 * Notion RichTextItemResponse 배열을 마크다운 인라인 텍스트로 변환합니다.
 * 볼드, 이탤릭, 코드, 취소선, 링크 등 인라인 서식을 처리합니다.
 */
function richTextToMarkdown(richTexts: RichTextItemResponse[]): string {
  return richTexts
    .map(item => {
      const text = item.plain_text

      if (!text) return ''

      // 링크 처리 (href가 있는 경우)
      const href = item.href
      if (href) {
        // 서식이 있는 링크는 마크다운 링크로 감싸기
        const linkText = applyAnnotations(text, item.annotations)
        return `[${linkText}](${href})`
      }

      return applyAnnotations(text, item.annotations)
    })
    .join('')
}

/**
 * 텍스트에 Notion 어노테이션(서식)을 적용합니다.
 */
function applyAnnotations(
  text: string,
  annotations: RichTextItemResponse['annotations']
): string {
  // 특수문자 이스케이프가 필요한 경우 처리
  let result = text

  if (annotations.code) {
    result = `\`${result}\``
  }
  if (annotations.bold && annotations.italic) {
    result = `***${result}***`
  } else if (annotations.bold) {
    result = `**${result}**`
  } else if (annotations.italic) {
    result = `*${result}*`
  }
  if (annotations.strikethrough) {
    result = `~~${result}~~`
  }

  return result
}

// ============================================================================
// 블록 유형별 마크다운 변환
// ============================================================================

/**
 * 단일 BlockObjectResponse를 마크다운 문자열로 변환합니다.
 * 지원하지 않는 블록 유형은 빈 문자열을 반환합니다.
 */
function blockToMarkdown(
  block: BlockObjectResponse,
  listState: ListState
): string {
  const type = block.type

  switch (type) {
    case 'paragraph': {
      const content = richTextToMarkdown(block.paragraph.rich_text)
      listState.reset()
      return content ? `${content}\n\n` : '\n'
    }

    case 'heading_1': {
      const content = richTextToMarkdown(block.heading_1.rich_text)
      listState.reset()
      return `# ${content}\n\n`
    }

    case 'heading_2': {
      const content = richTextToMarkdown(block.heading_2.rich_text)
      listState.reset()
      return `## ${content}\n\n`
    }

    case 'heading_3': {
      const content = richTextToMarkdown(block.heading_3.rich_text)
      listState.reset()
      return `### ${content}\n\n`
    }

    case 'bulleted_list_item': {
      const content = richTextToMarkdown(block.bulleted_list_item.rich_text)
      return `- ${content}\n`
    }

    case 'numbered_list_item': {
      const num = listState.incrementNumbered()
      const content = richTextToMarkdown(block.numbered_list_item.rich_text)
      return `${num}. ${content}\n`
    }

    case 'to_do': {
      const checked = block.to_do.checked ? '[x]' : '[ ]'
      const content = richTextToMarkdown(block.to_do.rich_text)
      listState.reset()
      return `- ${checked} ${content}\n`
    }

    case 'toggle': {
      // toggle은 마크다운에 직접적인 대응이 없으므로 볼드 텍스트로 표시
      const content = richTextToMarkdown(block.toggle.rich_text)
      listState.reset()
      return `**${content}**\n\n`
    }

    case 'quote': {
      const content = richTextToMarkdown(block.quote.rich_text)
      listState.reset()
      return `> ${content}\n\n`
    }

    case 'callout': {
      // callout은 인용문(blockquote) 형태로 표시
      const content = richTextToMarkdown(block.callout.rich_text)
      const icon =
        block.callout.icon?.type === 'emoji'
          ? `${block.callout.icon.emoji} `
          : ''
      listState.reset()
      return `> ${icon}${content}\n\n`
    }

    case 'code': {
      const code = richTextToMarkdown(block.code.rich_text)
      const language = block.code.language ?? 'plaintext'
      listState.reset()
      // Notion 코드 블록 언어 이름을 하이라이팅 ID로 변환
      const normalizedLang = normalizeLanguage(language)
      return `\`\`\`${normalizedLang}\n${code}\n\`\`\`\n\n`
    }

    case 'divider': {
      listState.reset()
      return `---\n\n`
    }

    case 'image': {
      listState.reset()
      let src = ''
      if (block.image.type === 'external') {
        src = block.image.external.url
      } else if (block.image.type === 'file') {
        src = block.image.file.url
      }
      const caption =
        block.image.caption.length > 0
          ? richTextToMarkdown(block.image.caption)
          : ''
      if (!src) return ''
      return `![${caption}](${src})\n\n`
    }

    case 'bookmark': {
      listState.reset()
      const url = block.bookmark.url
      const caption =
        block.bookmark.caption.length > 0
          ? richTextToMarkdown(block.bookmark.caption)
          : url
      return `[${caption}](${url})\n\n`
    }

    case 'table_of_contents': {
      // TOC 블록은 렌더링 시 자동 생성되므로 생략
      listState.reset()
      return ''
    }

    case 'breadcrumb':
    case 'column_list':
    case 'column': {
      // 복잡한 레이아웃 블록은 생략
      listState.reset()
      return ''
    }

    default:
      // 지원하지 않는 블록 유형은 빈 문자열 반환
      return ''
  }
}

// ============================================================================
// 리스트 상태 관리 (번호 매기기 리스트)
// ============================================================================

/**
 * 번호 매기기 리스트 상태 관리 클래스
 * - numbered_list_item이 연속될 때 번호 자동 증가
 * - 다른 블록 유형이 나오면 번호 초기화
 */
class ListState {
  private numberedCount = 0

  incrementNumbered(): number {
    return ++this.numberedCount
  }

  reset(): void {
    this.numberedCount = 0
  }
}

// ============================================================================
// 언어 이름 정규화
// ============================================================================

/**
 * Notion 코드 블록 언어 이름을 highlight.js 언어 ID로 변환합니다.
 */
function normalizeLanguage(language: string): string {
  const languageMap: Record<string, string> = {
    // Notion 언어 이름 → highlight.js ID 매핑
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    'c++': 'cpp',
    'c#': 'csharp',
    kotlin: 'kotlin',
    swift: 'swift',
    go: 'go',
    rust: 'rust',
    ruby: 'ruby',
    php: 'php',
    sql: 'sql',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yaml',
    shell: 'bash',
    bash: 'bash',
    markdown: 'markdown',
    'plain text': 'plaintext',
  }

  const lower = language.toLowerCase()
  return languageMap[lower] ?? lower.replace(/\s+/g, '')
}

// ============================================================================
// 공개 API
// ============================================================================

/**
 * Notion BlockObjectResponse 배열을 마크다운 문자열로 변환합니다.
 *
 * @param blocks Notion 블록 배열
 * @returns 마크다운 문자열
 */
export function blocksToMarkdown(blocks: BlockObjectResponse[]): string {
  const listState = new ListState()
  const lines: string[] = []

  for (const block of blocks) {
    const markdown = blockToMarkdown(block, listState)
    if (markdown) {
      lines.push(markdown)
    }
  }

  // 연속된 빈 줄 정리 (최대 2개 줄바꿈)
  return lines
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
