// 메인 항성성

export default function Star({
  position,
  color,
  size = 1,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <mesh position={position} onClick={onClick} receiveShadow={false}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
