import { create } from 'zustand';
import * as THREE from 'three';
import type { TPlanet, TStellarSystem } from '@/types/cosmos';

interface SceneStore {
  viewMode: 'Galaxy' | 'StellarSystem';
  focusedPosition: THREE.Vector3 | null;
  cameraIsMoving: boolean;
  cameraTarget: THREE.Vector3;
  selectedStellarSystemId: number | null;
  selectedStellarSystem: TStellarSystem | null;
  selectedPlanetIndex: number | null;

  setCameraTarget: (cameraTarget: THREE.Vector3) => void;
  setViewMode: (viewMode: 'Galaxy' | 'StellarSystem') => void;
  setFocusedPosition: (focusedPosition: THREE.Vector3 | null) => void;
  setCameraIsMoving: (cameraIsMoving: boolean) => void;
  setSelectedStellarSystemId: (selectedStellarSystemId: number | null) => void;
  setSelectedStellarSystem: (
    selectedStellarSystem: TStellarSystem | null
  ) => void;
  setSelectedPlanetIndex: (selectedPlanetIndex: number | null) => void;
  // 하위 데이터 변경을 위한 액션들
  updatePlanet: (planetIndex: number, updatedPlanet: Partial<TPlanet>) => void;
  updatePlanetProperty: (
    planetIndex: number,
    property: keyof TPlanet,
    value: number | string
  ) => void;
  addPlanet: (planet: TPlanet) => void;
  removePlanet: (planetIndex: number) => void;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  viewMode: 'Galaxy',
  focusedPosition: null,
  cameraIsMoving: false,
  cameraTarget: new THREE.Vector3(0, 0, 0),
  selectedStellarSystemId: null,
  selectedStellarSystem: null,
  selectedPlanetIndex: null,
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),
  setViewMode: (viewMode) => set({ viewMode }),
  setFocusedPosition: (focusedPosition) => set({ focusedPosition }),
  setCameraIsMoving: (cameraIsMoving) => set({ cameraIsMoving }),
  setSelectedStellarSystemId: (selectedStellarSystemId) =>
    set({ selectedStellarSystemId }),
  setSelectedStellarSystem: (selectedStellarSystem) =>
    set({ selectedStellarSystem }),
  setSelectedPlanetIndex: (selectedPlanetIndex) => set({ selectedPlanetIndex }),
  updatePlanet: (planetIndex, updatedPlanet) => {
    const { selectedStellarSystem } = get();
    if (selectedStellarSystem) {
      const updatedPlanets = [...selectedStellarSystem.planets];
      updatedPlanets[planetIndex] = {
        ...updatedPlanets[planetIndex],
        ...updatedPlanet,
      };

      set({
        selectedStellarSystem: {
          ...selectedStellarSystem,
          planets: updatedPlanets,
        },
      });
    }
  },

  updatePlanetProperty: (planetIndex, property, value) => {
    const { selectedStellarSystem } = get();
    if (selectedStellarSystem) {
      const updatedPlanets = [...selectedStellarSystem.planets];
      updatedPlanets[planetIndex] = {
        ...updatedPlanets[planetIndex],
        [property]: value,
      };

      set({
        selectedStellarSystem: {
          ...selectedStellarSystem,
          planets: updatedPlanets,
        },
      });
    }
  },

  addPlanet: (planet) => {
    const { selectedStellarSystem } = get();
    if (selectedStellarSystem) {
      set({
        selectedStellarSystem: {
          ...selectedStellarSystem,
          planets: [...selectedStellarSystem.planets, planet],
        },
      });
    }
  },

  removePlanet: (planetIndex) => {
    const { selectedStellarSystem } = get();
    if (selectedStellarSystem) {
      const updatedPlanets = selectedStellarSystem.planets.filter(
        (_, index) => index !== planetIndex
      );
      set({
        selectedStellarSystem: {
          ...selectedStellarSystem,
          planets: updatedPlanets,
        },
      });
    }
  },
}));
