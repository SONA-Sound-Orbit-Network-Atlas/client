//은하계 컴포넌트

import StellarSystem from "./StellarSystem";

export default function Galaxy() {
    return (
        <group>
            <StellarSystem stellarSystemPos={[0, 0, 0]} />
            <StellarSystem stellarSystemPos={[20, 0, 0]} />
            <StellarSystem stellarSystemPos={[-30, 0, 0]} />
            <StellarSystem stellarSystemPos={[0, 1, 30]} />
            <StellarSystem stellarSystemPos={[0, -2, 10]} />
            <StellarSystem stellarSystemPos={[0, 0, 120]} />
            <StellarSystem stellarSystemPos={[0, 0, -130]} />
        </group>
    )
}