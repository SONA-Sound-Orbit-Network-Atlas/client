import { create } from 'zustand';

interface SelectedStellarStore {
  selectedStellarId: string;
  setSelectedStellarId: (no: string) => void;
}

export const useSelectedStellarStore = create<SelectedStellarStore>((set) => ({
  selectedStellarId: 'sys-001', // 초기 값
  setSelectedStellarId: (no: string) => set({ selectedStellarId: no }),
}));
