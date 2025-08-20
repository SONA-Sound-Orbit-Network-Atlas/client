// 임시 구체 모델델
export default function DummySphere({ position, color, size = 1 }: { 
    position: [number, number, number], 
    color: string, 
    size?: number 
  }) {
    return (
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    )
  }