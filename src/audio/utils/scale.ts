// 스케일 / 키 양자화 유틸리티
// 항성의 Key/Scale에 따라 MIDI 노트를 양자화합니다.

import type { KeyName, ScaleName } from '../../types/audio';

// 스케일별 인터벌 정의 (반음 단위)
const SCALE_INTERVALS: Record<ScaleName, number[]> = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10]
};

// 키별 루트 노트 (반음 단위)
const KEY_TO_SEMITONE: Record<KeyName, number> = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 
  'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11
};

// MIDI 노트를 지정된 키/스케일로 양자화
export function quantizeToScale(midi: number, key: KeyName, scale: ScaleName): number {
  const root = KEY_TO_SEMITONE[key];
  const intervals = SCALE_INTERVALS[scale];
  const octave = Math.floor(midi / 12);
  const degree = (midi % 12 + 12) % 12;
  
  // 이미 스케일 내부면 그대로 반환
  if (intervals.includes((degree - root + 12) % 12)) {
    return midi;
  }
  
  // 가장 가까운 스케일 음 찾기
  let bestInterval = intervals[0];
  let minDistance = 99;
  
  for (const interval of intervals) {
    const targetDegree = (root + interval) % 12;
    const distance = Math.min(
      Math.abs(targetDegree - degree), 
      12 - Math.abs(targetDegree - degree)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      bestInterval = interval;
    }
  }
  
  return octave * 12 + ((root + bestInterval) % 12);
}

// 스케일 인터벌 직접 반환 (코드 생성용)
export function getScaleIntervals(scale: ScaleName): number[] {
  return SCALE_INTERVALS[scale];
}

// 키의 루트 노트 반환
export function getKeyRoot(key: KeyName): number {
  return KEY_TO_SEMITONE[key];
}
