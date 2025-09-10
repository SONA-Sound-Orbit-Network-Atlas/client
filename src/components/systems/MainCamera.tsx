import QuarterViewControls from '../controllers/QuarterViewControls';
import OrbitViewControls from '../controllers/OrbitViewControls';
import { useSceneStore } from '@/stores/useSceneStore';
import * as THREE from 'three';

export default function MainCamera() {
  const { viewMode, cameraTarget, selectedStellarSystemId } = useSceneStore();

  return (
    <>
      {viewMode === 'Galaxy' && <QuarterViewControls />}
      {viewMode === 'StellarSystem' && (
        <OrbitViewControls
          key={`stellar-${selectedStellarSystemId}`} // 강제 리렌더링을 위한 key
          targetPosition={cameraTarget ?? new THREE.Vector3(0, 0, 0)}
        />
      )}
    </>
  );
}
