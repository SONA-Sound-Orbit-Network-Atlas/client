import { create } from "zustand";
import * as THREE from "three";

interface SceneStore {
    viewMode: 'Galaxy' | 'StellarSystem';
    focusedPosition: THREE.Vector3 | null;
    cameraIsMoving: boolean;
    setViewMode: (viewMode: 'Galaxy' | 'StellarSystem') => void;
    setFocusedPosition: (focusedPosition: THREE.Vector3 | null) => void;
    setCameraIsMoving: (cameraIsMoving: boolean) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
    viewMode: 'Galaxy',
    focusedPosition: null,
    cameraIsMoving: false,
    setViewMode: (viewMode) => set({ viewMode }),
    setFocusedPosition: (focusedPosition) => set({ focusedPosition }),
    setCameraIsMoving: (cameraIsMoving) => set({ cameraIsMoving }),
}));