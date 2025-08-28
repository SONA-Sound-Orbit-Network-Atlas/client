import { create } from "zustand";
import * as THREE from "three";

interface SceneStore {
    viewMode: 'Galaxy' | 'StellarSystem';
    focusedPosition: THREE.Vector3 | null;
    cameraIsMoving: boolean;
    cameraTarget: THREE.Vector3;
    setCameraTarget: (cameraTarget: THREE.Vector3) => void;
    setViewMode: (viewMode: 'Galaxy' | 'StellarSystem') => void;
    setFocusedPosition: (focusedPosition: THREE.Vector3 | null) => void;
    setCameraIsMoving: (cameraIsMoving: boolean) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
    viewMode: 'Galaxy',
    focusedPosition: null,
    cameraIsMoving: false,
    cameraTarget: new THREE.Vector3(0,0,0),
    setCameraTarget: (cameraTarget) => set({ cameraTarget }),
    setViewMode: (viewMode) => set({ viewMode }),
    setFocusedPosition: (focusedPosition) => set({ focusedPosition }),
    setCameraIsMoving: (cameraIsMoving) => set({ cameraIsMoving }),
}));