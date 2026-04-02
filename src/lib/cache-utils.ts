// ============================================================================
// 캐시 항목 내부 타입
// ============================================================================

/**
 * 캐시에 저장되는 단일 항목 구조
 */
interface CacheEntry<T> {
  /** 저장된 값 */
  value: T
  /** 저장 시각 (Unix ms) */
  createdAt: number
  /** 만료 시각 (Unix ms), undefined이면 영구 보관 */
  expiresAt: number | undefined
}

// ============================================================================
// CacheManager 클래스
// ============================================================================

/**
 * 제네릭 인메모리 캐시 클래스입니다.
 * TTL(Time To Live)을 지원하며, 키 패턴 기반 무효화도 제공합니다.
 *
 * @template T - 캐시에 저장할 값의 타입
 */
export class CacheManager<T> {
  private readonly store = new Map<string, CacheEntry<T>>()
  /** 기본 TTL (밀리초). undefined이면 만료 없음 */
  private readonly defaultTtlMs: number | undefined

  /**
   * @param defaultTtlMs - 기본 TTL (밀리초). 생략하면 만료 없음
   */
  constructor(defaultTtlMs?: number) {
    this.defaultTtlMs =
      defaultTtlMs !== undefined && defaultTtlMs > 0 ? defaultTtlMs : undefined
  }

  // --------------------------------------------------------------------------
  // 내부 헬퍼
  // --------------------------------------------------------------------------

  /**
   * 캐시 항목이 만료되었는지 확인합니다.
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    if (entry.expiresAt === undefined) return false
    return Date.now() > entry.expiresAt
  }

  /**
   * 만료된 항목을 스토어에서 제거합니다.
   * 성능이 중요한 경우 주기적으로 호출할 수 있습니다.
   */
  private purgeExpired(): void {
    for (const [key, entry] of this.store.entries()) {
      if (this.isExpired(entry)) {
        this.store.delete(key)
      }
    }
  }

  // --------------------------------------------------------------------------
  // 공개 API
  // --------------------------------------------------------------------------

  /**
   * 키에 값을 저장합니다.
   *
   * @param key - 캐시 키
   * @param value - 저장할 값
   * @param ttlMs - 이 항목의 TTL (밀리초). 생략하면 기본 TTL 사용
   */
  set(key: string, value: T, ttlMs?: number): void {
    const effectiveTtl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs
    const createdAt = Date.now()
    const expiresAt =
      effectiveTtl !== undefined ? createdAt + effectiveTtl : undefined

    this.store.set(key, { value, createdAt, expiresAt })
  }

  /**
   * 키에 해당하는 값을 반환합니다.
   * 만료되었거나 없으면 undefined를 반환합니다.
   *
   * @param key - 조회할 캐시 키
   * @returns 저장된 값 또는 undefined
   */
  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (this.isExpired(entry)) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * 키가 유효한 캐시 항목을 가지고 있는지 확인합니다.
   *
   * @param key - 확인할 캐시 키
   * @returns 유효한 항목이 있으면 true
   */
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  /**
   * 특정 키의 캐시 항목을 삭제합니다.
   *
   * @param key - 삭제할 캐시 키
   */
  delete(key: string): void {
    this.store.delete(key)
  }

  /**
   * 모든 캐시 항목을 삭제합니다.
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * 키에 값이 있으면 반환하고, 없으면 fn을 실행하여 저장 후 반환합니다.
   *
   * @param key - 캐시 키
   * @param fn - 캐시 미스 시 실행할 값 생성 함수
   * @param ttlMs - 이 항목의 TTL (밀리초)
   * @returns 캐시된 값 또는 fn의 반환값
   */
  getOrSet(key: string, fn: () => T, ttlMs?: number): T {
    const cached = this.get(key)
    if (cached !== undefined) return cached

    const value = fn()
    this.set(key, value, ttlMs)
    return value
  }

  /**
   * 키 패턴에 매칭되는 모든 캐시 항목을 삭제합니다.
   * 패턴은 단순 문자열 포함 여부로 판단합니다.
   *
   * @param pattern - 삭제할 키에 포함되어야 하는 문자열
   */
  invalidateByPattern(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key)
      }
    }
  }

  /**
   * 현재 유효한 캐시 항목 수를 반환합니다.
   * 만료된 항목은 먼저 정리 후 카운트합니다.
   *
   * @returns 유효한 캐시 항목 수
   */
  get size(): number {
    this.purgeExpired()
    return this.store.size
  }

  /**
   * 유효한 모든 캐시 키 목록을 반환합니다. (디버깅용)
   *
   * @returns 유효한 캐시 키 배열
   */
  keys(): string[] {
    this.purgeExpired()
    return Array.from(this.store.keys())
  }
}

// ============================================================================
// 메모이제이션 헬퍼
// ============================================================================

/**
 * 함수 호출 결과를 메모이제이션합니다.
 * 동일한 인수(JSON 직렬화 기준)에 대해 이전 결과를 반환합니다.
 * TTL을 지정하면 일정 시간 후 캐시가 만료됩니다.
 *
 * @param fn - 메모이제이션할 함수
 * @param ttlMs - 캐시 유효 시간 (밀리초). 생략하면 영구 캐시
 * @returns 메모이제이션된 함수
 */
export function memoize<TArgs extends readonly unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  ttlMs?: number
): (...args: TArgs) => TResult {
  const cache = new CacheManager<TResult>(ttlMs)

  return (...args: TArgs): TResult => {
    // 인수를 JSON 직렬화하여 캐시 키로 사용
    let cacheKey: string
    try {
      cacheKey = JSON.stringify(args)
    } catch {
      // 직렬화 불가능한 인수는 캐시하지 않고 바로 실행
      return fn(...args)
    }

    return cache.getOrSet(cacheKey, () => fn(...args))
  }
}

// ============================================================================
// 전역 캐시 무효화 헬퍼
// ============================================================================

/**
 * 여러 CacheManager 인스턴스에서 패턴에 매칭되는 항목을 일괄 무효화합니다.
 *
 * @param pattern - 무효화할 키에 포함되어야 하는 문자열
 * @param managers - 대상 CacheManager 배열
 */
export function invalidateCache(
  pattern: string,
  managers: CacheManager<unknown>[]
): void {
  for (const manager of managers) {
    manager.invalidateByPattern(pattern)
  }
}

// ============================================================================
// 편의 팩토리 함수
// ============================================================================

/**
 * 기본 TTL이 5분인 CacheManager 인스턴스를 생성합니다.
 *
 * @returns 5분 TTL CacheManager
 */
export function createDefaultCache<T>(): CacheManager<T> {
  return new CacheManager<T>(5 * 60 * 1000) // 5분
}

/**
 * 기본 TTL이 1시간인 CacheManager 인스턴스를 생성합니다.
 *
 * @returns 1시간 TTL CacheManager
 */
export function createLongCache<T>(): CacheManager<T> {
  return new CacheManager<T>(60 * 60 * 1000) // 1시간
}

/**
 * 만료 없는 영구 CacheManager 인스턴스를 생성합니다.
 *
 * @returns 영구 CacheManager
 */
export function createPermanentCache<T>(): CacheManager<T> {
  return new CacheManager<T>()
}
