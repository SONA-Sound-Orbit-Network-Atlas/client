import { useFrame } from "@react-three/fiber";
import { useSceneStore } from "@/stores/useSceneStore";

/**
 * 카메라 줌 거리 초과 시 카메라 모드 변경
 * @param distanceRef 카메라 줌 거리 참조주소
 * @param targetDistance 카메라 줌 거리 목표값
 * @param movementLockRef 카메라 이동 잠금 상태 참조주소 
 * @param onOutOfDistance 카메라 줌 거리 초과 시 콜백
 */

interface UseChangeViewModeOnOutOfDistanceProps {
    distanceRef: React.RefObject<number>;
    targetDistance: number;
    movementLockRef: React.RefObject<boolean>;
    onOutOfDistance?: () => void;
}

export function UseChangeViewModeOnOutOfDistance({ distanceRef,targetDistance=20,onOutOfDistance,movementLockRef }: UseChangeViewModeOnOutOfDistanceProps){
    const { setViewMode } = useSceneStore();
    useFrame(() => {
        // 줌 거리 체크 (항상 실행)
        if(movementLockRef.current) return;  
        if (distanceRef.current > targetDistance) {   
            console.log('줌 거리 초과');    
            setViewMode('Galaxy');
            onOutOfDistance?.();
        }
    });
}