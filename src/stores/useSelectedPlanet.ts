import { create } from 'zustand';

interface SelectedPlanetStore {
  selectedPlanetNo: number;
  setSelectedPlanetNo: (no: number) => void;
}

export const useSelectedPlanet = create<SelectedPlanetStore>((set) => ({
  selectedPlanetNo: 0,
  setSelectedPlanetNo: (no: number) => {
    set({ selectedPlanetNo: no });
  },
}));
