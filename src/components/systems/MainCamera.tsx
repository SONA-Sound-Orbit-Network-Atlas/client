import QuarterViewControls from '../controllers/QuarterViewControls';
import OrbitViewControls from '../controllers/OrbitViewControls';
import { useSceneStore } from '@/stores/useSceneStore';
import * as THREE from 'three';

export default function MainCamera() {
  const { cameraTarget, selectedStellarSystemId } = useSceneStore();

  return (
    <>
      <QuarterViewControls />
      <OrbitViewControls
        key={`stellar-${selectedStellarSystemId}`} // 강제 리렌더링을 위한 key
        targetPosition={cameraTarget ?? new THREE.Vector3(0, 0, 0)}
      />
    </>
  );
}
