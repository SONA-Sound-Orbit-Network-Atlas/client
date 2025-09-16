import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene from '../components/Scene';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import TestButtons from '@/components/cosmos/TestButtons';

export default function SpacePage() {
  const canvasStyle = {
    background: '#1a1a1a',
    width: '100%',
    height: '100%',
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <h1 className="text-white p-4">Space</h1>
          <TestButtons />
          <div className="flex-1 min-h-0 relative">
            <Canvas style={canvasStyle} shadows>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
