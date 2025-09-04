import { create } from 'zustand';
import type { PlanetPropertiesType } from '@/types/planetProperties';

const initialPlanetProperties: PlanetPropertiesType[] = [
  { name: '게이지 1', value: 0, min: 0, max: 100 },
  { name: '게이지 2', value: 0, min: 0, max: 360 },
  { name: '게이지 3', value: 0, min: 0, max: 100 },
  { name: '게이지 4', value: 0, min: 0, max: 100 },
  { name: '게이지 5', value: 0, min: 0, max: 100 },
  { name: '게이지 6', value: 0, min: 0, max: 100 },
  { name: '게이지 7', value: 0, min: 0, max: 360 },
];

interface PlanetPropertiesStore {
  planetProperties: PlanetPropertiesType[];
  setPlanetProperties: (properties: PlanetPropertiesType[]) => void;
}

export const usePlanetProperties = create<PlanetPropertiesStore>((set) => ({
  planetProperties: initialPlanetProperties,
  setPlanetProperties: (properties: PlanetPropertiesType[]) => {
    set({ planetProperties: properties });
  },
}));
