// src/utils/createId.ts
export type IdPrefix = 'planet' | 'star' | 'system' | 'id';
export type BrandedId<P extends IdPrefix = 'id'> = `${P}_${string}`;

export function createId<P extends IdPrefix = 'id'>(
  prefix: P = 'id' as P
): BrandedId<P> {
  const g: any = globalThis as any; // eslint-disable-line

  if (g.crypto?.randomUUID) {
    return `${prefix}_${g.crypto.randomUUID()}` as BrandedId<P>;
  }

  // 폴백: 시간기반 + 난수(base36)
  const ts = Date.now().toString(36); // 가독성 좋은 짧은 타임스탬프
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${ts}${rand}` as BrandedId<P>;
}

// 편의 함수
export const createPlanetId = () => createId('planet'); // → `${'planet'}_${string}`
export const createStarId = () => createId('star');
