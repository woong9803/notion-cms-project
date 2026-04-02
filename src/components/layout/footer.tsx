import { Container } from './container'

export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-8">
          <div className="text-center">
            {/* DevPath 프로젝트 푸터 */}
            <p className="text-muted-foreground text-sm">
              © 2026 DevPath. Notion CMS 기반 학습 로드맵 & 데브로그
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
