import { CameraControls } from '@react-three/drei';

export default function GalaxyViewControls() {
  return (
    <CameraControls
      mouseButtons={{
        left: THREE.MOUSE.PAN,
        middle: THREE.MOUSE.DOLLY,
        right: THREE.MOUSE.ROTATE,
        wheel: THREE.MOUSE.DOLLY,
      }}
    />
  );
}
