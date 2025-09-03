// 음악적 규칙 시스템 테스트 유틸리티
// 개발/디버깅 시 패턴 품질을 빠르게 검증할 수 있도록 도와줍니다.

import type { InstrumentRole } from '../../types/audio';
import { generateAdvancedPattern } from './advancedPattern';
import { calculateMusicalQuality } from './musicalRules';
import { RandomManager } from './random';

// 역할별 테스트 패턴 생성 및 품질 평가
export function testMusicalQuality(role: InstrumentRole, seed: string = 'test'): void {
  console.log(`\n🎼 ${role} 음악적 품질 테스트`);
  console.log('=' .repeat(40));
  
  // 시드 설정으로 일관된 결과 보장
  const rng = RandomManager.instance;
  rng.setSeed(seed);
  
  // 테스트 파라미터
  const testParams = {
    pulses: role === 'PAD' ? 4 : role === 'ARPEGGIO' ? 12 : 8,
    steps: 16,
    rotation: 0,
    swingPct: 0,
    accentDb: 0,
    gateLen: 0.7
  };
  
  // 패턴 생성
  const pattern = generateAdvancedPattern(testParams, role, 2, rng);
  
  // 품질 평가
  const quality = calculateMusicalQuality(pattern.steps, role);
  
  console.log(`패턴: ${pattern.steps.map(s => s ? '●' : '○').join(' ')}`);
  console.log(`액센트: ${pattern.accents.map(a => a ? '!' : '·').join(' ')}`);
  console.log(`품질 점수: ${(quality * 100).toFixed(1)}%`);
  console.log(`밀도: ${pattern.steps.filter(s => s === 1).length}/${pattern.steps.length}`);
}

// 모든 역할에 대한 테스트 실행
export function testAllRoles(): void {
  const roles: InstrumentRole[] = ['BASS', 'DRUM', 'CHORD', 'MELODY', 'ARPEGGIO', 'PAD'];
  
  console.log('\n🎵 SONA 음악적 규칙 시스템 테스트');
  console.log('=' .repeat(50));
  
  roles.forEach(role => testMusicalQuality(role));
  
  console.log('\n✅ 테스트 완료');
}

// 품질 비교 테스트 (이전 vs 개선된 버전)
export function comparePatternQuality(role: InstrumentRole, iterations: number = 10): void {
  console.log(`\n📊 ${role} 패턴 품질 비교 (${iterations}회 평균)`);
  console.log('=' .repeat(40));
  
  const rng = RandomManager.instance;
  const testParams = {
    pulses: 8,
    steps: 16,
    rotation: 0,
    swingPct: 0,
    accentDb: 0,
    gateLen: 0.7
  };
  
  let totalQuality = 0;
  
  for (let i = 0; i < iterations; i++) {
    rng.setSeed(`compare-${role}-${i}`);
    const pattern = generateAdvancedPattern(testParams, role, 2, rng);
    const quality = calculateMusicalQuality(pattern.steps, role);
    totalQuality += quality;
  }
  
  const avgQuality = totalQuality / iterations;
  console.log(`평균 음악적 품질: ${(avgQuality * 100).toFixed(1)}%`);
}
