// src/components/ThreeSlopeScene.js
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeSlopeScene({ analysis, crackPoints, getSlopeColor }) {
  return (
    <Canvas camera={{ position: [0, 8, 15], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>

      {/* Slope */}
      <mesh rotation={[(-(analysis.slopeAngle - 30) * Math.PI) / 180, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial
          color={getSlopeColor(analysis.slopeAngle)}
          side={2}
          opacity={0.95}
          transparent
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Crack Points */}
      {crackPoints.map((p, i) => (
        <group key={i}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="red"
              opacity={0.85}
              transparent
              emissive="red"
              emissiveIntensity={0.6}
            />
          </mesh>
          <Text position={[p.x, p.y + 0.5, p.z]} fontSize={0.35} color="black">
            ({p.x.toFixed(1)}, {p.y.toFixed(1)}, {p.z.toFixed(1)})
          </Text>
        </group>
      ))}

      <Text position={[0, 5, 0]} fontSize={0.7} color="black">
        Slope Angle: {analysis.slopeAngle}°
      </Text>
      <OrbitControls />
    </Canvas>
  );
}
