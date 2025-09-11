import type { TStellarSystem } from './cosmos';
import * as THREE from 'three';

export type ViewMode = 'Galaxy' | 'StellarSystem';
export type TransitionState =
  | 'idle'
  | 'preparing'
  | 'transitioning'
  | 'completing';

export interface GalaxyTransitionOptions {
  resetSelection?: boolean;
  cameraTarget?: THREE.Vector3;
  preserveCameraPosition?: boolean;
}

export interface StellarSystemTransitionOptions {
  stellarSystemId: number;
  stellarSystem: TStellarSystem;
  focusPosition: THREE.Vector3;
  transitionDuration?: number;
  cameraDistance?: number;
}
