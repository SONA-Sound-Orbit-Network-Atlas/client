import { create } from 'zustand';

type PanelMode = 'idle' | 'view' | 'create';
// view: 기존 stellar 보기
// idle: 아무 것도 선택 안 함(SelectRequired 보여줌)
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
  setSelectedStellarId: (id) => set({ mode: 'view', selectedStellarId: id }),
  setIdle: () => set({ mode: 'idle', selectedStellarId: '' }),
  setCreate: () => set({ mode: 'create', selectedStellarId: '' }),
}));
