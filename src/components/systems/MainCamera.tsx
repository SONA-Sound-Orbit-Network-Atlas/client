import QuarterViewControls from '../controllers/QuarterViewControls';
import OrbitViewControls from '../controllers/OrbitViewControls';
import { useSceneStore } from '@/stores/useSceneStore';
import * as THREE from 'three';

export default function MainCamera() {
  const { viewMode, focusedPosition } = useSceneStore();

  return (
    <>
      {viewMode === 'Galaxy' && <QuarterViewControls />}
      {viewMode === 'StellarSystem' && (
        <OrbitViewControls
          targetPosition={focusedPosition ?? new THREE.Vector3(0, 0, 0)}
        />
      )}
    </>
  );
}
