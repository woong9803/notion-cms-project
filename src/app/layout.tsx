import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/** 사이트 기본 URL */
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://devpath.vercel.app')

export const metadata: Metadata = {
  // 타이틀 템플릿: 하위 페이지는 "페이지명 | DevPath" 형식으로 자동 설정
  title: {
    template: '%s | DevPath',
    default: 'DevPath - 학습 로드맵 & 데브로그',
  },
  description:
    'Notion CMS 기반으로 React Native, Expo 등 기술 스택 학습 기록과 진척도를 시각화하고 공유하는 개발 학습 대시보드',
  // 캐노니컬 URL 설정
  metadataBase: new URL(BASE_URL),
  // Open Graph 기본값 (하위 페이지가 재정의 가능)
  openGraph: {
    type: 'website',
    siteName: 'DevPath',
    locale: 'ko_KR',
  },
  // Twitter Card 기본값
  twitter: {
    card: 'summary_large_image',
    site: '@devpath',
  },
  // 검색 엔진 크롤링 기본값
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // PWA 및 앱 관련 메타
  applicationName: 'DevPath',
  authors: [{ name: 'DevPath' }],
  // 아이콘 (public 폴더의 favicon.ico 자동 사용)
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
