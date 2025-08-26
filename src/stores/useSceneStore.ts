import { create } from "zustand";
import * as THREE from "three";

interface SceneStore {
    viewMode: 'Galaxy' | 'StellarSystem';
    focusedPosition: THREE.Vector3 | null;
    setViewMode: (viewMode: 'Galaxy' | 'StellarSystem') => void;
    setFocusedPosition: (focusedPosition: THREE.Vector3 | null) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
    viewMode: 'Galaxy',
    focusedPosition: null,
    setViewMode: (viewMode) => set({ viewMode }),
    setFocusedPosition: (focusedPosition) => set({ focusedPosition }),
}));