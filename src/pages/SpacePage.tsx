import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene from '../components/Scene';
import Header from '@/components/layout/Header/Header';
import Sidebar from '@/components/layout/Sidebar/Sidebar';

export default function SpacePage() {
  const canvasStyle = {
    background: '#000000',
    width: '100%',
    height: '100%',
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex-1 min-h-0 min-w-0 relative w-full h-full overflow-hidden">
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
