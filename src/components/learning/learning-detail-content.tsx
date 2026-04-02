'use client'

// 학습 항목 상세 페이지 마크다운 콘텐츠 렌더러
// react-markdown 기반 렌더링 + 코드 하이라이팅 통합
import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/learning/code-block'

/**
 * LearningDetailContent 컴포넌트 Props
 */
interface LearningDetailContentProps {
  /** 마크다운 원문 콘텐츠 */
  content: string
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 내부 링크 여부 판단
 * - '/'로 시작하거나 현재 도메인인 경우 내부 링크
 */
function isInternalLink(href: string): boolean {
  if (!href) return false
  return (
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith(process.env.NEXT_PUBLIC_SITE_URL ?? '')
  )
}

/**
 * 마크다운 요소별 Tailwind 스타일 컴포넌트 맵핑
 * - 서식 일관성을 위해 직접 Tailwind 클래스 적용
 */
const markdownComponents = {
  // ====== 헤딩 ======
  h1: ({ className, children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className={cn(
        'text-foreground mt-8 mb-4 scroll-mt-20 text-2xl leading-tight font-bold',
        'border-border border-b pb-2',
        'first:mt-0',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ className, children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className={cn(
        'text-foreground mt-7 mb-3 scroll-mt-20 text-xl leading-tight font-bold',
        'first:mt-0',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ className, children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className={cn(
        'text-foreground mt-6 mb-2 scroll-mt-20 text-lg leading-snug font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  ),

  h4: ({ className, children, ...props }: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      className={cn(
        'text-foreground mt-5 mb-2 scroll-mt-20 text-base font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  ),

  // ====== 본문 텍스트 ======
  p: ({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p
      className={cn(
        'text-foreground mb-4 text-base leading-7',
        'last:mb-0',
        className
      )}
      {...props}
    >
      {children}
    </p>
  ),

  // ====== 강조 ======
  strong: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'strong'>) => (
    <strong
      className={cn('text-foreground font-semibold', className)}
      {...props}
    >
      {children}
    </strong>
  ),

  em: ({ className, children, ...props }: ComponentPropsWithoutRef<'em'>) => (
    <em className={cn('italic', className)} {...props}>
      {children}
    </em>
  ),

  // ====== 코드 ======
  // 인라인 코드와 코드 블록을 구분하여 처리
  code: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
    // 코드 블록인지 인라인 코드인지 판단 (className에 'language-' 접두사 포함 여부)
    const isBlock = className?.startsWith('language-')

    if (isBlock) {
      // 코드 블록은 pre 컴포넌트에서 처리하므로 그냥 children 반환
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    // 인라인 코드 스타일
    return (
      <code
        className={cn(
          'bg-muted text-foreground',
          'rounded px-1.5 py-0.5',
          'font-mono text-[0.875em]',
          'border-border/50 border',
          className
        )}
        {...props}
      >
        {children}
      </code>
    )
  },

  // pre 태그에서 CodeBlock 컴포넌트 렌더링
  pre: ({ children }: ComponentPropsWithoutRef<'pre'>) => {
    // children에서 code 엘리먼트 정보 추출
    const codeElement = children as React.ReactElement<{
      className?: string
      children?: string
    }>

    if (
      codeElement &&
      typeof codeElement === 'object' &&
      'props' in codeElement
    ) {
      const codeProps = codeElement.props
      const codeContent =
        typeof codeProps.children === 'string' ? codeProps.children : ''
      const languageMatch = codeProps.className?.match(/language-(\w+)/)
      const language = languageMatch ? languageMatch[1] : 'plaintext'

      return <CodeBlock language={language}>{codeContent}</CodeBlock>
    }

    // fallback: 원본 pre 태그 사용
    return (
      <pre className="bg-muted my-4 overflow-x-auto rounded-lg p-4 font-mono text-sm">
        {children}
      </pre>
    )
  },

  // ====== 링크 ======
  a: ({
    href = '',
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'a'>) => {
    // 앵커 링크 처리 (#으로 시작)
    if (href.startsWith('#')) {
      return (
        <a
          href={href}
          className={cn(
            'text-primary underline underline-offset-4',
            'hover:text-primary/80 transition-colors',
            className
          )}
          {...props}
        >
          {children}
        </a>
      )
    }

    // 내부 링크는 Next.js Link 컴포넌트 사용
    if (isInternalLink(href)) {
      return (
        <Link
          href={href}
          className={cn(
            'text-primary underline underline-offset-4',
            'hover:text-primary/80 transition-colors',
            className
          )}
        >
          {children}
        </Link>
      )
    }

    // 외부 링크: 새 탭으로 열기 + 보안 속성 추가
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'text-primary underline underline-offset-4',
          'hover:text-primary/80 transition-colors',
          // 외부 링크 표시 아이콘 (after pseudo element via CSS)
          'inline-flex items-baseline gap-0.5',
          className
        )}
        {...props}
      >
        {children}
        {/* 외부 링크 표시 */}
        <span className="text-muted-foreground text-xs" aria-hidden="true">
          ↗
        </span>
      </a>
    )
  },

  // ====== 이미지 ======
  img: ({
    src,
    alt = '',
    className,
    ...props
  }: ComponentPropsWithoutRef<'img'>) => {
    // src가 문자열인지 확인 (Blob 타입 제외)
    const srcStr = typeof src === 'string' ? src : undefined

    // 이미지 URL 유효성 검사
    const isValidSrc =
      srcStr && (srcStr.startsWith('http') || srcStr.startsWith('/'))

    if (!isValidSrc || !srcStr) return null

    // next.config.ts의 remotePatterns에 등록된 도메인은 최적화 적용
    // 미등록 외부 도메인은 unoptimized 처리
    const allowedHostnames = [
      'amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'www.notion.so',
      'images.unsplash.com',
    ]
    const isAllowedExternal = allowedHostnames.some(host =>
      srcStr.includes(host)
    )
    const shouldUnoptimize = srcStr.startsWith('http') && !isAllowedExternal

    return (
      <span className="my-6 block">
        <Image
          src={srcStr}
          alt={alt}
          width={800}
          height={450}
          quality={80}
          className={cn(
            'h-auto w-full rounded-lg',
            'border-border border',
            className
          )}
          // 지연 로딩 (뷰포트 외 이미지 로딩 지연)
          loading="lazy"
          // 미등록 외부 URL은 Next.js 이미지 최적화 미적용
          unoptimized={shouldUnoptimize}
          {...(props as Partial<React.ComponentProps<typeof Image>>)}
        />
        {/* alt 텍스트가 있는 경우 캡션으로 표시 */}
        {alt && (
          <span className="text-muted-foreground mt-2 block text-center text-sm">
            {alt}
          </span>
        )}
      </span>
    )
  },

  // ====== 리스트 ======
  ul: ({ className, children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className={cn(
        'text-foreground mb-4 list-disc pl-6',
        'space-y-1.5',
        '[&>li>ul]:mt-1.5 [&>li>ul]:mb-0',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ className, children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={cn(
        'text-foreground mb-4 list-decimal pl-6',
        'space-y-1.5',
        '[&>li>ol]:mt-1.5 [&>li>ol]:mb-0',
        className
      )}
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ className, children, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li className={cn('text-base leading-7', className)} {...props}>
      {children}
    </li>
  ),

  // ====== 인용문 ======
  blockquote: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className={cn(
        'border-primary/50 bg-muted/50',
        'my-4 rounded-r-lg border-l-4 px-4 py-3',
        'text-muted-foreground italic',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),

  // ====== 구분선 ======
  hr: ({ className, ...props }: ComponentPropsWithoutRef<'hr'>) => (
    <hr className={cn('border-border my-8', className)} {...props} />
  ),

  // ====== 테이블 ======
  table: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-4 overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse text-sm',
          'border-border overflow-hidden rounded-lg border',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  thead: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className={cn('bg-muted/70 text-foreground', className)} {...props}>
      {children}
    </thead>
  ),

  tbody: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody
      className={cn(
        '[&>tr:nth-child(even)]:bg-muted/30',
        '[&>tr]:border-border [&>tr]:border-t',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  ),

  th: ({ className, children, ...props }: ComponentPropsWithoutRef<'th'>) => (
    <th
      className={cn(
        'px-4 py-2.5 text-left font-semibold',
        'border-border border-r last:border-r-0',
        className
      )}
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ className, children, ...props }: ComponentPropsWithoutRef<'td'>) => (
    <td
      className={cn(
        'px-4 py-2.5',
        'border-border border-r last:border-r-0',
        className
      )}
      {...props}
    >
      {children}
    </td>
  ),
}

/**
 * 학습 항목 상세 콘텐츠 영역
 * - react-markdown 기반 마크다운 렌더링
 * - remark-gfm: 테이블, 취소선, 태스크 리스트 등 GFM 확장 지원
 * - CodeBlock: 코드 블록 문법 하이라이팅
 * - Next.js Image: 이미지 최적화
 * - 내부/외부 링크 구분 처리
 */
export function LearningDetailContent({
  content,
  className,
}: LearningDetailContentProps) {
  // 콘텐츠가 없는 경우 빈 상태 표시
  const isEmpty = !content || content.trim().length === 0

  if (isEmpty) {
    return (
      <div
        className={cn(
          'flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed',
          className
        )}
        role="region"
        aria-label="콘텐츠 영역"
      >
        <FileText
          className="text-muted-foreground h-10 w-10"
          aria-hidden="true"
        />
        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            콘텐츠가 없습니다
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Notion 페이지에서 콘텐츠를 작성해주세요
          </p>
        </div>
      </div>
    )
  }

  return (
    <article
      className={cn(
        // 최대 너비 제한 없음 (부모 컨테이너에서 제어)
        'min-w-0',
        className
      )}
      role="main"
      aria-label="학습 콘텐츠"
    >
      {/* 마크다운 렌더링 영역 */}
      <div className="markdown-content">
        <ReactMarkdown
          // GFM 확장: 테이블, 취소선, 태스크 리스트, URL 자동 링크
          remarkPlugins={[remarkGfm]}
          // 커스텀 컴포넌트 맵핑
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
