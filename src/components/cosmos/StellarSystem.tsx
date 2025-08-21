import Star from "./Star"
import Planet from "./Planet"

//항성계 컴포넌트 

export default function StellarSystem({StellarSysyemPos }: { 
    StellarSysyemPos: [number, number, number]
  }) {
    return (
       <group position={StellarSysyemPos}>
       {/* 여러 개의 구체들을 다양한 위치에 배치 */}
       <Star position={[0, 0, 0]} color="#ff6b6b" size={1.5} />
       <Planet position={[3, 2, 0]} color="#4ecdc4" size={1} />
       <Planet position={[-3, -1, 2]} color="#45b7d1" size={0.8} />
       <Planet position={[0, 3, -2]} color="#96ceb4" size={1.2} />
       <Planet position={[4, -2, 1]} color="#feca57" size={0.6} />
       <Planet position={[-4, 1, -1]} color="#ff9ff3" size={0.9} />
       </group>
    )
}