//은하계 컴포넌트

import StellarSystem from './StellarSystem';

export default function Galaxy() {
  return (
    <group>
      <StellarSystem stellarSystemPos={[0, 0, 0]} id={'sys-001'} />
      <StellarSystem stellarSystemPos={[20, 0, 0]} id={'sys-002'} />
      <StellarSystem stellarSystemPos={[-30, 0, 0]} id={'sys-003'} />
      <StellarSystem stellarSystemPos={[0, 1, 30]} id={'sys-004'} />
      <StellarSystem stellarSystemPos={[0, -2, 10]} id={'sys-005'} />
      <StellarSystem stellarSystemPos={[0, 0, 120]} id={'sys-006'} />
      <StellarSystem stellarSystemPos={[0, 0, -130]} id={'sys-007'} />
    </group>
  );
}
