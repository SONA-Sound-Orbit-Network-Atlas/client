//은하계 컴포넌트

import StellarSystem from "./StellarSystem";

export default function Galaxy() {
    return (
        <group>
            <StellarSystem StellarSysyemPos={[0, 0, 0]} />
            <StellarSystem StellarSysyemPos={[20, 0, 0]} />
            <StellarSystem StellarSysyemPos={[-30, 0, 0]} />
            <StellarSystem StellarSysyemPos={[0, 1, 30]} />
            <StellarSystem StellarSysyemPos={[0, -2, 10]} />
            <StellarSystem StellarSysyemPos={[0, 0, 120]} />
            <StellarSystem StellarSysyemPos={[0, 0, -130]} />
        </group>
    )
}