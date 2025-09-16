import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene from '../components/Scene';
import DebugMessage from '@/components/DebugMessage';
import Header from '@/components/layout/Header/Header';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import TestSliders from '@/components/TestSliders';
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

            {/* 디버그 메시지 오버레이 */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontSize: '16px',
                pointerEvents: 'none',
              }}
            >
              <DebugMessage />
            </div>

            <TestSliders />
          </div>
        </div>
      </div>
    </div>
  );
}
