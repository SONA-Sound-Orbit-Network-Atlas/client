import { create } from 'zustand';
import { StellarSystem } from '@/audio/core/StellarSystem';

type PanelMode = 'idle' | 'view' | 'create';
// idle: 아무 것도 선택 안 함(SelectRequired 보여줌)
// view: 기존 stellar 보기
// create: 새 galaxy/stellar 생성 폼

interface SelectedStellarStore {
  mode: PanelMode;
  selectedStellarId: string;
  setSelectedStellarId: (id: string) => void;
  setIdle: () => void;
  setCreate: () => void;
}

export const useSelectedStellarStore = create<SelectedStellarStore>((set) => ({
  mode: 'idle',
  selectedStellarId: '', // 초기 값 '' , 테스트아이디 sys-001 (이 스텔라의 userId는 testUser)
  setSelectedStellarId: (id) =>
    set(() => {
      // 항상 리셋을 호출하여 동일 스텔라 재선택 시에도 오디오 시스템을 초기화합니다.
      try {
        StellarSystem.instance.resetImmediate();
      } catch (err) {
        console.debug('setSelectedStellarId: resetImmediate failed', err);
      }
      return { mode: 'view', selectedStellarId: id };
    }),
  setIdle: () =>
    set(() => {
      StellarSystem.instance.resetImmediate();
      return { mode: 'idle', selectedStellarId: '' };
    }),
  setCreate: () =>
    set(() => {
      StellarSystem.instance.resetImmediate();
      return { mode: 'create', selectedStellarId: '' };
    }),
}));
