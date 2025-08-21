import { useRef, useState } from "react";
import Star from "./Star"
import Planet from "./Planet"
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

//항성계 컴포넌트 


export default function StellarSystem({StellarSysyemPos }: { 
    StellarSysyemPos: [number, number, number]
  }) {
    const ref = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const [showDetail, setShowDetail] = useState(false);
    const [detailFactor, setDetailFactor] = useState(0);

    useFrame(()=>{
        if(!ref.current) return;

        const systemPos = new THREE.Vector3(...StellarSysyemPos);
        const distance = camera.position.distanceTo(systemPos);

        const factor = 1 - Math.min(Math.max((distance - 20) / 10,0),1);
        setDetailFactor(factor);

        setShowDetail(distance<30);
    });

    return (
    //    <group ref={ref} position={StellarSysyemPos}>
    //    {/* 여러 개의 구체들을 다양한 위치에 배치 */}
    //    {showDetail? (
    //     <>
    //     <Star position={[0, 0, 0]} color="#ff6b6b" size={1.5} />
    //     <Planet position={[3, 2, 0]} color="#4ecdc4" size={1} />
    //     <Planet position={[-3, -1, 2]} color="#45b7d1" size={0.8} />
    //     <Planet position={[0, 3, -2]} color="#96ceb4" size={1.2} />
    //     <Planet position={[4, -2, 1]} color="#feca57" size={0.6} />
    //     <Planet position={[-4, 1, -1]} color="#ff9ff3" size={0.9} />
    //     </>
    //     ):(
    //        <mesh>
//     <sphereGeometry args={[1.5, 16, 16]} />
//     <meshStandardMaterial color="#ff6b6b"
//         emissive="#ffffff"
//         emissiveIntensity={0.5}
//         toneMapped={false} />
// </mesh>
    //    )}
    //    </group>
    <group ref={ref} position={StellarSysyemPos}>
       <group scale={[detailFactor, detailFactor, detailFactor]}>
        <Star position={[0, 0, 0]} color="#ff6b6b" size={1.5} />
        <Planet position={[3, 2, 0]} color="#4ecdc4" size={1} />
        <Planet position={[-3, -1, 2]} color="#45b7d1" size={0.8} />
        <Planet position={[0, 3, -2]} color="#96ceb4" size={1.2} />
        <Planet position={[4, -2, 1]} color="#feca57" size={0.6} />
        <Planet position={[-4, 1, -1]} color="#ff9ff3" size={0.9} />
       </group>
       <mesh scale={[1-detailFactor, 1-detailFactor, 1-detailFactor]}>
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshStandardMaterial color="#ff6b6b"
                    emissive="#ffffff"
                    emissiveIntensity={0.5}
                    toneMapped={false} />
            </mesh>
       
       </group>
    )
}