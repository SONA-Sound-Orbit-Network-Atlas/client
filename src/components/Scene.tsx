import { Grid} from '@react-three/drei';
import * as THREE from 'three';
import QuarterViewControls from "./controllers/QuarterViewControls";
import Galaxy from "./cosmos/Galaxy";
import { useSceneStore } from '@/stores/useSceneStore';
import { useEffect } from 'react';
import OrbitViewControls from './controllers/OrbitViewControls';

// 화면 표시
export default function Scene() {
    const { viewMode, focusedPosition, setViewMode } = useSceneStore();
    const axesHelper = new THREE.AxesHelper(5);

    useEffect(() => {
        if (focusedPosition) {
            setViewMode('StellarSystem');
        } else {
            setViewMode('Galaxy');
        }
    }, [focusedPosition]);

    return (
      <>
        {/* 조명 설정 */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
        />
        {/* 별자리 시스템 */}
        <Galaxy />
        
        
        {/* 그리드 헬퍼 (공간감을 위해) */}
        <Grid args={[20, 20]} />
        
        {/* 축 헬퍼 */}
        <primitive object = {axesHelper}/>
       
        {viewMode === 'Galaxy' && <QuarterViewControls />}
        {viewMode === 'StellarSystem' && <OrbitViewControls targetPosition={focusedPosition || new THREE.Vector3(0,0,0)} />}
      </>
    )
  }