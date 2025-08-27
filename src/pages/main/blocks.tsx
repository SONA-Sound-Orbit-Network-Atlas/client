import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import state from './store';
import { useBlock, offsetContext } from './useBlock';

type BlockProps = {
  children: React.ReactNode;
  offset?: number;
  factor?: number;
  [key: string]: unknown;
};

export function Block({ children, offset, factor = 1, ...props }: BlockProps) {
  const { offset: parentOffset, sectionHeight } = useBlock();
  const ref = useRef<THREE.Group>(null);

  offset = offset !== undefined ? offset : parentOffset;

  useFrame(() => {
    if (!ref.current) return;

    const curY = ref.current.position.y;
    const curTop = state.top;
    ref.current.position.y = THREE.MathUtils.lerp(
      curY,
      (curTop / state.zoom) * factor,
      0.1
    );
  });

  return (
    <offsetContext.Provider value={offset}>
      <group {...props} position={[0, -sectionHeight * offset * factor, 0]}>
        <group ref={ref}>{children}</group>
      </group>
    </offsetContext.Provider>
  );
}
