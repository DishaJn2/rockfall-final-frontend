import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Html } from "@react-three/drei";

function RiskZone({ position, color, label, riskLevel }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5; // rotate slowly
    }
    if (materialRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 5); // blinking
      materialRef.current.emissiveIntensity = Math.max(0, pulse);
      materialRef.current.color.set(pulse > 0 ? color : "#ff8080");
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={1}
      />
      <Html position={[0, 1, 0]}>
        <div
          className={`animate-pulse px-2 py-1 rounded shadow text-xs text-white ${
            riskLevel === "high"
              ? "bg-red-600"
              : riskLevel === "medium"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          {label}
        </div>
      </Html>
    </mesh>
  );
}

export default RiskZone;
