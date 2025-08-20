import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Scene from "../components/Scene"


export default function StellarSystem() {
  const canvasStyle = {
    background: '#1a1a1a',
    width: '100vw',
    height: '100vh'
  };
  return (
    <div>
      <h1>Stellar System</h1>
      <Canvas
        style={canvasStyle}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}