import { create } from 'zustand';

interface SelectedObjectStore {
  selectedObjectId: string;
  setSelectedObjectId: (no: string) => void;
}

export const useSelectedObjectStore = create<SelectedObjectStore>((set) => ({
  selectedObjectId: '',
  setSelectedObjectId: (id: string) => set({ selectedObjectId: id }),
}));
