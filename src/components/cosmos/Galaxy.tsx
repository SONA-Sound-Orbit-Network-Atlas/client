//은하계 컴포넌트

import StellarSystem from './StellarSystem';

const dummyStellarList = [
  { id: 'sys-001', stellarSystemPos: [0, 0, 0], starColor: 0 },
  { id: 'sys-002', stellarSystemPos: [20, 0, 0], starColor: 60 },
  { id: 'sys-003', stellarSystemPos: [-30, 0, 0], starColor: 120 },
  { id: 'sys-004', stellarSystemPos: [0, 1, 30], starColor: 180 },
  { id: 'sys-005', stellarSystemPos: [0, -2, 10], starColor: 240 },
  { id: 'sys-006', stellarSystemPos: [0, 0, 120], starColor: 300 },
  { id: 'sys-007', stellarSystemPos: [0, 0, -130], starColor: 45 },
];

export default function Galaxy() {
  return (
    <group>
      {dummyStellarList.map((stellar) => (
        <StellarSystem
          key={stellar.id}
          stellarSystemPos={
            stellar.stellarSystemPos as [number, number, number]
          }
          id={stellar.id}
          starColor={stellar.starColor}
        />
      ))}
    </group>
  );
}
