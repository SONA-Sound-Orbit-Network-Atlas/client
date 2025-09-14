//은하계 컴포넌트

import StellarSystem from './StellarSystem';

const dummyStellarList = [
  { id: 'sys-001', stellarSystemPos: [0, 0, 0] },
  { id: 'sys-002', stellarSystemPos: [20, 0, 0] },
  { id: 'sys-003', stellarSystemPos: [-30, 0, 0] },
  { id: 'sys-004', stellarSystemPos: [0, 1, 30] },
  { id: 'sys-005', stellarSystemPos: [0, -2, 10] },
  { id: 'sys-006', stellarSystemPos: [0, 0, 120] },
  { id: 'sys-007', stellarSystemPos: [0, 0, -130] },
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
        />
      ))}
    </group>
  );
}
