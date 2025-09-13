// Stellar 패널 Tab value 스토어
import { create } from 'zustand';

type StellarTab = 'OBJECTS' | 'INFO' | 'PROPERTIES';

interface TabState {
  tabValue: StellarTab;
  setTabValue: (value: StellarTab) => void;
}

export const useStellarTabStore = create<TabState>()((set) => ({
  tabValue: 'OBJECTS', // 초기 탭
  setTabValue: (value) => set({ tabValue: value }),
}));
