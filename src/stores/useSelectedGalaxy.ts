import { create } from 'zustand';

interface SelectedGalaxyStore {
  selectedGalaxyId: number;
  setSelectedGalaxyId: (no: number) => void;
}

export const useSelectedGalaxy = create<SelectedGalaxyStore>((set) => ({
  selectedGalaxyId: 0,
  setSelectedGalaxyId: (no: number) => set({ selectedGalaxyId: no }),
}));
