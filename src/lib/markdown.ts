// 마크다운 유틸리티 함수 모음
// 목차 추출, 읽기 시간 계산, 앵커 ID 생성 등

/**
 * 목차(Table of Contents) 항목 타입
 */
export interface TocItem {
  /** 앵커 링크용 ID (제목을 slug로 변환) */
  id: string
  /** 헤딩 텍스트 */
  title: string
  /** 헤딩 레벨 (1=h1, 2=h2, 3=h3) */
  level: 1 | 2 | 3
}

/**
 * 한국어/영문 제목을 앵커 ID(slug)로 변환
 * - 공백 → 하이픈
 * - 영문 소문자 변환
 * - 특수문자 제거 (한국어 유니코드는 유지)
 *
 * @param text 변환할 원본 텍스트
 * @returns slug 문자열
 */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // 영문/숫자/한국어/하이픈/공백 외 특수문자 제거
      .replace(/[^\w\s가-힣-]/g, '')
      // 연속 공백/하이픈 → 단일 하이픈
      .replace(/[\s_]+/g, '-')
      // 앞뒤 하이픈 제거
      .replace(/^-+|-+$/g, '')
  )
}

/**
 * 마크다운 텍스트에서 목차 항목 추출
 * - h1, h2, h3 헤딩만 추출 (h4 이하 제외)
 * - 코드 블록 내부의 헤딩은 무시
 *
 * @param markdown 마크다운 원문 텍스트
 * @returns TocItem 배열
 */
export function extractToc(markdown: string): TocItem[] {
  const tocItems: TocItem[] = []
  // 중복 ID 방지를 위한 카운터 맵
  const idCountMap = new Map<string, number>()

  let inCodeBlock = false
  const lines = markdown.split('\n')

  for (const line of lines) {
    // 코드 블록 시작/종료 감지 (``` 또는 ~~~)
    if (/^`{3,}|^~{3,}/.test(line.trim())) {
      inCodeBlock = !inCodeBlock
      continue
    }

    // 코드 블록 내부는 건너뜀
    if (inCodeBlock) continue

    // 헤딩 패턴 매칭 (최대 3레벨)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (!headingMatch) continue

    const level = headingMatch[1].length as 1 | 2 | 3
    const rawTitle = headingMatch[2].trim()

    // 마크다운 인라인 서식 제거 (볼드, 이탤릭, 코드, 링크)
    const plainTitle = rawTitle
      .replace(/\*\*(.+?)\*\*/g, '$1') // 볼드 제거
      .replace(/\*(.+?)\*/g, '$1') // 이탤릭 제거
      .replace(/`(.+?)`/g, '$1') // 인라인 코드 제거
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 링크 텍스트만 유지
      .trim()

    // slug 생성 (중복 처리)
    const baseSlug = slugify(plainTitle)
    const count = idCountMap.get(baseSlug) ?? 0
    const uniqueSlug = count === 0 ? baseSlug : `${baseSlug}-${count}`
    idCountMap.set(baseSlug, count + 1)

    tocItems.push({
      id: uniqueSlug,
      title: plainTitle,
      level,
    })
  }

  return tocItems
}

/**
 * 마크다운 텍스트의 읽기 시간 계산
 * - 영문: 분당 200단어
 * - 한국어: 분당 300자 기준 (한글은 단어 대신 문자 수 활용)
 * - 코드 블록은 읽기 속도 절반으로 계산
 * - 최소 1분 반환
 *
 * @param markdown 마크다운 원문 텍스트
 * @returns 예상 읽기 시간 (분 단위, 정수)
 */
export function calculateReadingTime(markdown: string): number {
  // 마크다운 서식 기호 제거 후 순수 텍스트 추출
  const cleanText = markdown
    .replace(/```[\s\S]*?```/g, match => match) // 코드 블록은 유지 (별도 처리)
    .replace(/#{1,6}\s/g, '') // 헤딩 마크 제거
    .replace(/\*\*|__|~~|\*/g, '') // 볼드/이탤릭/취소선 마크 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 → 텍스트만 유지
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // 이미지 제거
    .replace(/>\s/gm, '') // 인용문 마크 제거

  // 코드 블록 별도 분리
  const codeBlocks = markdown.match(/```[\s\S]*?```/g) ?? []
  const codeWordCount = codeBlocks
    .map(
      block =>
        block
          .replace(/```[\w]*\n?|```/g, '')
          .trim()
          .split(/\s+/).length
    )
    .reduce((sum, count) => sum + count, 0)

  // 일반 텍스트에서 코드 블록 제거
  const normalText = cleanText.replace(/```[\s\S]*?```/g, '')

  // 한국어 문자 수 계산 (가-힣 범위)
  const koreanCharCount = (normalText.match(/[가-힣]/g) ?? []).length

  // 영문/숫자 단어 수 계산
  const englishWordCount = normalText
    .replace(/[가-힣]/g, '') // 한국어 제거
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length

  // 읽기 시간 계산
  // - 영문 200단어/분, 한국어 300자/분, 코드 100단어/분
  const minutesForEnglish = englishWordCount / 200
  const minutesForKorean = koreanCharCount / 300
  const minutesForCode = codeWordCount / 100

  const totalMinutes = minutesForEnglish + minutesForKorean + minutesForCode

  return Math.max(1, Math.ceil(totalMinutes))
}

/**
 * 마크다운 텍스트에서 플레인 텍스트 추출
 * - 서식 기호 모두 제거
 * - SEO 설명문, 요약 생성에 활용
 *
 * @param markdown 마크다운 원문 텍스트
 * @param maxLength 최대 문자 수 (기본값: 160)
 * @returns 플레인 텍스트 문자열
 */
export function extractPlainText(markdown: string, maxLength = 160): string {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/#{1,6}\s/g, '') // 헤딩 마크 제거
    .replace(/\*\*(.+?)\*\*/g, '$1') // 볼드 → 텍스트
    .replace(/\*(.+?)\*/g, '$1') // 이탤릭 → 텍스트
    .replace(/~~(.+?)~~/g, '$1') // 취소선 → 텍스트
    .replace(/`(.+?)`/g, '$1') // 인라인 코드 → 텍스트
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 → 텍스트
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // 이미지 제거
    .replace(/>\s/gm, '') // 인용문 마크 제거
    .replace(/[-*+]\s/gm, '') // 리스트 마크 제거
    .replace(/\n+/g, ' ') // 줄바꿈 → 공백
    .trim()

  if (plainText.length <= maxLength) return plainText
  // 단어 경계에서 자르기
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}
