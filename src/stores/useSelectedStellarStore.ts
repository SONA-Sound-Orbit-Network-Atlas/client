import { create } from 'zustand';

interface SelectedStellarStore {
  selectedStellarId: string;
  setSelectedStellarId: (no: string) => void;
}

export const useSelectedStellarStore = create<SelectedStellarStore>((set) => ({
  selectedStellarId: '', // 초기 값 '' , 테스트아이디 sys-001 (이 스텔라의 userId는 testUser)
  setSelectedStellarId: (no: string) => set({ selectedStellarId: no }),
}));
