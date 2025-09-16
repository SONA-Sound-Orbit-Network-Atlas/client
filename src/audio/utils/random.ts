// RandomManager - StellarSystem에서 관리하는 시드 기반 결정론적 난수 유틸리티
// 동일한 seed 를 설정하면 항상 동일한 패턴/노트 초기값을 재생산할 수 있도록 합니다.
// 내부적으로 가벼운 PRNG (mulberry32 변형) 사용.

import type { IRandomSource } from '../interfaces/IRandomSource';

// SeededRng는 IRandomSource와 동일하지만 의미적으로 분리
export type SeededRng = IRandomSource;

function hashString(str: string): number {
  let h = 2166136261 >>> 0; // FNV 기반 간단 해시
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class InternalSeededRng implements SeededRng {
  private fn: () => number;
  constructor(seed: number) {
    this.fn = mulberry32(seed >>> 0);
  }
  nextFloat(): number { return this.fn(); }
  nextInt(min: number, max: number): number {
    if (max < min) { const tmp = min; min = max; max = tmp; }
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }
  choice<T>(arr: T[]): T { return arr[this.nextInt(0, arr.length - 1)]; }
}

export class RandomManager implements IRandomSource {
  private static _instance: RandomManager | null = null;
  private baseSeed = 0xABCDEF01;
  private rng: SeededRng = new InternalSeededRng(this.baseSeed);

  static get instance(): RandomManager {
    if (!this._instance) this._instance = new RandomManager();
    return this._instance;
  }

  // seed 는 number 또는 string 허용. string 은 hash 로 변환
  setSeed(seed: number | string): void {
    const numericSeed = typeof seed === 'number' ? seed : hashString(seed);
    this.baseSeed = numericSeed >>> 0;
    this.rng = new InternalSeededRng(this.baseSeed);
    console.log(`🎲 RandomManager seed 설정: ${this.baseSeed}`);
  }

  // 하위 도메인별 분리된 결정 난수 생성 (role, planetId, step 등)
  getDomainRng(domain: string): SeededRng {
    const domainSeed = (this.baseSeed ^ hashString(domain)) >>> 0;
    return new InternalSeededRng(domainSeed);
  }

  nextFloat(): number { return this.rng.nextFloat(); }
  nextInt(min: number, max: number): number { return this.rng.nextInt(min, max); }
  choice<T>(arr: T[]): T { return this.rng.choice(arr); }
}

// 편의 함수 (기존 Math.random 대체)
export function rnd(): number { return RandomManager.instance.nextFloat(); }
