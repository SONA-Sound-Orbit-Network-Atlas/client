//은하계 컴포넌트

import StellarSystem from './StellarSystem';

export default function Galaxy() {
  return (
    <group>
      <StellarSystem stellarSystemPos={[0, 0, 0]} id={1} />
      <StellarSystem stellarSystemPos={[20, 0, 0]} id={2} />
      <StellarSystem stellarSystemPos={[-30, 0, 0]} id={3} />
      <StellarSystem stellarSystemPos={[0, 1, 30]} id={4} />
      <StellarSystem stellarSystemPos={[0, -2, 10]} id={5} />
      <StellarSystem stellarSystemPos={[0, 0, 120]} id={6} />
      <StellarSystem stellarSystemPos={[0, 0, -130]} id={7} />
    </group>
  );
}
