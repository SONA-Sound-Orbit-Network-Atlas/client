import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

export default function BackgroundStars() {
  const { camera } = useThree();
  const starsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.position.copy(camera.position);
    }
  });

  return <Stars ref={starsRef} radius={300} depth={100} count={1500} />;
}
