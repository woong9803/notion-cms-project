'use client'

// 코드 블록 컴포넌트 - 문법 하이라이팅 + 복사 버튼
import { useState, useEffect, useCallback } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * CodeBlock 컴포넌트 Props
 */
interface CodeBlockProps {
  /** 코드 내용 */
  children: string
  /** 프로그래밍 언어 (예: 'typescript', 'javascript', 'bash') */
  language?: string
  /** 파일명 표시 레이블 (선택사항) */
  filename?: string
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 지원하는 언어 목록 (highlight.js 언어 ID)
 * 자주 사용하는 언어만 포함하여 번들 크기 최소화
 */
const SUPPORTED_LANGUAGES = new Set([
  'javascript',
  'js',
  'typescript',
  'ts',
  'tsx',
  'jsx',
  'python',
  'py',
  'java',
  'css',
  'html',
  'json',
  'bash',
  'sh',
  'shell',
  'markdown',
  'md',
  'yaml',
  'yml',
  'sql',
  'rust',
  'go',
  'c',
  'cpp',
])

/**
 * 언어 표시명 매핑
 */
const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  markdown: 'Markdown',
  md: 'Markdown',
  yaml: 'YAML',
  yml: 'YAML',
  sql: 'SQL',
  rust: 'Rust',
  go: 'Go',
  c: 'C',
  cpp: 'C++',
}

/**
 * 코드 블록 컴포넌트
 * - highlight.js 기반 문법 하이라이팅
 * - 복사 버튼 (클립보드 API)
 * - 언어 레이블 표시
 * - 다크/라이트 모드 지원 (CSS 변수 기반 테마)
 */
export function CodeBlock({
  children,
  language = 'plaintext',
  filename,
  className,
}: CodeBlockProps) {
  // 하이라이팅된 HTML 저장
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  // 복사 완료 상태 (피드백 UI 표시용)
  const [isCopied, setIsCopied] = useState(false)
  // 하이라이팅 로드 상태
  const [isLoaded, setIsLoaded] = useState(false)

  // 코드 문자열 정규화 (앞뒤 공백/줄바꿈 제거)
  const normalizedCode = children.trim()

  // 언어 정규화 (소문자 변환)
  const normalizedLanguage = language.toLowerCase().replace(/^language-/, '')

  // 사용할 실제 언어 ID 결정
  const effectiveLanguage = SUPPORTED_LANGUAGES.has(normalizedLanguage)
    ? normalizedLanguage
    : 'plaintext'

  // 언어 표시 레이블
  const languageLabel =
    LANGUAGE_LABELS[effectiveLanguage] || effectiveLanguage.toUpperCase()

  // highlight.js 동적 임포트 (클라이언트 전용)
  useEffect(() => {
    let cancelled = false

    const loadAndHighlight = async () => {
      try {
        const hljs = (await import('highlight.js/lib/core')).default

        // 언어별 동적 로드 (번들 크기 최소화)
        if (!hljs.getLanguage(effectiveLanguage)) {
          const languageMap: Record<
            string,
            () => Promise<{ default: unknown }>
          > = {
            javascript: () => import('highlight.js/lib/languages/javascript'),
            js: () => import('highlight.js/lib/languages/javascript'),
            typescript: () => import('highlight.js/lib/languages/typescript'),
            ts: () => import('highlight.js/lib/languages/typescript'),
            tsx: () => import('highlight.js/lib/languages/typescript'),
            jsx: () => import('highlight.js/lib/languages/javascript'),
            python: () => import('highlight.js/lib/languages/python'),
            py: () => import('highlight.js/lib/languages/python'),
            java: () => import('highlight.js/lib/languages/java'),
            css: () => import('highlight.js/lib/languages/css'),
            html: () => import('highlight.js/lib/languages/xml'),
            xml: () => import('highlight.js/lib/languages/xml'),
            json: () => import('highlight.js/lib/languages/json'),
            bash: () => import('highlight.js/lib/languages/bash'),
            sh: () => import('highlight.js/lib/languages/bash'),
            shell: () => import('highlight.js/lib/languages/bash'),
            yaml: () => import('highlight.js/lib/languages/yaml'),
            yml: () => import('highlight.js/lib/languages/yaml'),
            sql: () => import('highlight.js/lib/languages/sql'),
            rust: () => import('highlight.js/lib/languages/rust'),
            go: () => import('highlight.js/lib/languages/go'),
            c: () => import('highlight.js/lib/languages/c'),
            cpp: () => import('highlight.js/lib/languages/cpp'),
            markdown: () => import('highlight.js/lib/languages/markdown'),
            md: () => import('highlight.js/lib/languages/markdown'),
          }

          const loader = languageMap[effectiveLanguage]
          if (loader) {
            const langModule = await loader()
            // highlight.js 언어 등록
            hljs.registerLanguage(
              effectiveLanguage,
              langModule.default as Parameters<typeof hljs.registerLanguage>[1]
            )
          }
        }

        if (!cancelled) {
          // 하이라이팅 실행
          const result =
            effectiveLanguage === 'plaintext'
              ? { value: escapeHtml(normalizedCode) }
              : hljs.highlight(normalizedCode, { language: effectiveLanguage })

          setHighlightedCode(result.value)
          setIsLoaded(true)
        }
      } catch {
        // 하이라이팅 실패 시 이스케이프된 원본 텍스트로 폴백
        if (!cancelled) {
          setHighlightedCode(escapeHtml(normalizedCode))
          setIsLoaded(true)
        }
      }
    }

    loadAndHighlight()

    return () => {
      cancelled = true
    }
  }, [normalizedCode, effectiveLanguage])

  // 클립보드 복사 핸들러
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(normalizedCode)
      setIsCopied(true)
      // 2초 후 복사 완료 상태 초기화
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // 클립보드 API 미지원 환경 폴백
      const textarea = document.createElement('textarea')
      textarea.value = normalizedCode
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [normalizedCode])

  return (
    <div
      className={cn(
        // 외부 컨테이너: 둥근 모서리, 오버플로우 숨김
        'not-prose group relative my-4 overflow-hidden rounded-lg',
        // 다크 배경 (코드 블록은 항상 다크 테마)
        'bg-[#1e1e2e]',
        // 보더
        'border border-white/10',
        className
      )}
    >
      {/* ====== 코드 블록 상단 헤더 ====== */}
      <div
        className={cn(
          'flex items-center justify-between',
          'border-b border-white/10',
          'bg-white/5 px-4 py-2'
        )}
      >
        {/* 좌측: 언어 레이블 또는 파일명 */}
        <span className="font-mono text-xs text-white/50">
          {filename ?? languageLabel}
        </span>

        {/* 우측: 복사 버튼 */}
        <button
          onClick={handleCopy}
          className={cn(
            // 기본 스타일
            'flex items-center gap-1.5 rounded px-2 py-1',
            'font-mono text-xs transition-all duration-150',
            // 복사 완료 상태별 색상 전환
            isCopied
              ? 'text-emerald-400'
              : 'text-white/40 hover:bg-white/10 hover:text-white/80',
            // 포커스 링
            'focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none'
          )}
          aria-label={isCopied ? '복사 완료' : '코드 복사'}
          title={isCopied ? '복사 완료!' : '코드 복사'}
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>

      {/* ====== 코드 영역 ====== */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          {isLoaded ? (
            // 하이라이팅된 HTML 렌더링
            <code
              className={cn(
                `language-${effectiveLanguage}`,
                // highlight.js 기본 스타일 오버라이드
                'hljs block font-mono',
                // 텍스트 색상 (dark theme)
                'text-[#cdd6f4]'
              )}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          ) : (
            // 로딩 중: 원본 텍스트 표시
            <code className="block font-mono text-[#cdd6f4]">
              {normalizedCode}
            </code>
          )}
        </pre>
      </div>
    </div>
  )
}

/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 * plaintext 언어 사용 시 적용
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
