import { create } from 'zustand';

interface SelectedObjectStore {
  selectedObjectId: 'star_001' | string;
  setSelectedObjectId: (no: string) => void;
}

export const useSelectedObjectStore = create<SelectedObjectStore>((set) => ({
  selectedObjectId: 'star_001',
  setSelectedObjectId: (id: string) => set({ selectedObjectId: id }),
}));
