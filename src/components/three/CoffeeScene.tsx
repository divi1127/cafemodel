import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

function Beans() {
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh position={[0, 0, 0]} rotation={[0.4, 0.2, 0.1]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#6b3f24" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0.7, 0.2, -0.2]} rotation={[0.2, 0.8, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#c4a574" roughness={0.35} />
      </mesh>
      <mesh position={[-0.55, -0.15, 0.25]}>
        <torusGeometry args={[0.28, 0.08, 12, 32]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.3} />
      </mesh>
    </Float>
  );
}

export function CoffeeScene() {
  return (
    <div className="h-[280px] w-full md:h-[360px]">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} color="#ffe8c8" />
        <Suspense fallback={null}>
          <Beans />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}

export function FloatingObject({ className }: { className?: string }) {
  return (
    <div className={className}>
      <CoffeeScene />
    </div>
  );
}
