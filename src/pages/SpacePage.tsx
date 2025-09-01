import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene from '../components/Scene';
import DebugMessage from '@/components/DebugMessage';

export default function SpacePage() {
  const canvasStyle = {
    background: '#1a1a1a',
    width: '100vw',
    height: '100vh',
  };
  return (
    <div>
      <h1>Space</h1>
      <DebugMessage />
      <Canvas style={canvasStyle} shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
