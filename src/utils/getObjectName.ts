// src/utils/stellarObject.ts
import type { Star, Planet } from '@/types/stellar';
import { useStellarStore } from '@/stores/useStellarStore';

/** objectId로 Star/Planet 객체를 찾아 반환 (없으면 null) */
export function getObjectById(objectId?: string): Star | Planet | null {
  if (!objectId) return null;
  const { star, planets } = useStellarStore.getState().stellarStore;

  if (star?.id === objectId) return star;
  const planet = planets.find((p) => p.id === objectId);
  return planet ?? null;
}

/** objectId로 name 문자열 반환 (없으면 null) */
export function getObjectNameById(objectId?: string): string | null {
  const obj = getObjectById(objectId);
  return obj?.name ?? null;
}
