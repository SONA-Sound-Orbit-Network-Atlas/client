import { create } from 'zustand';

interface SelectedObjectStore {
  selectedObjectId: number;
  setSelectedObjectId: (no: number) => void;
}

export const useSelectedObjectStore = create<SelectedObjectStore>((set) => ({
  selectedObjectId: 0,
  setSelectedObjectId: (no: number) => set({ selectedObjectId: no }),
}));
