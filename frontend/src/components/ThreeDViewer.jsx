"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';

// 1. Quantum Bloch Sphere Simulation
function QuantumSphere() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer translucent sphere representing the state space */}
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial color="#8b5cf6" wireframe transparent opacity={0.15} />
      </Sphere>
      
      {/* Inner probability cloud */}
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial color="#c084fc" distort={0.5} speed={2} roughness={0.2} transparent opacity={0.6} />
      </Sphere>
      
      {/* Axes */}
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="gray" lineWidth={1} />
      <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="gray" lineWidth={1} />
      <Line points={[[0, 0, -2.5], [0, 0, 2.5]]} color="gray" lineWidth={1} />
      
      {/* State Vector (|ψ>) */}
      <Line points={[[0, 0, 0], [1.4, 1.4, 0]]} color="#06b6d4" lineWidth={5} />
      <mesh position={[1.4, 1.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
    </group>
  );
}

// 2. DNA / Protein Molecule Simulation
function Molecule() {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Generate a mock double helix
  const atoms = [];
  const bonds = [];
  for (let i = 0; i < 40; i++) {
    const t = i * 0.4;
    const x1 = Math.cos(t) * 1.5;
    const z1 = Math.sin(t) * 1.5;
    const y1 = i * 0.2 - 4;
    
    const x2 = Math.cos(t + Math.PI) * 1.5;
    const z2 = Math.sin(t + Math.PI) * 1.5;
    const y2 = i * 0.2 - 4;

    atoms.push(
      <mesh key={`a1-${i}`} position={[x1, y1, z1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.3} metalness={0.8} />
      </mesh>,
      <mesh key={`a2-${i}`} position={[x2, y2, z2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
      </mesh>
    );

    // Connecting bond
    bonds.push(
      <Line key={`b-${i}`} points={[[x1, y1, z1], [x2, y2, z2]]} color="white" transparent opacity={0.3} lineWidth={2} />
    );
  }

  return (
    <group ref={groupRef}>
      {atoms}
      {bonds}
    </group>
  );
}

export default function ThreeDViewer({ type = "quantum_sphere" }) {
  return (
    <div className="w-full h-full relative cursor-move bg-gradient-to-b from-transparent to-[#050505]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {type === "quantum_sphere" && <QuantumSphere />}
        {type === "molecule" && <Molecule />}
        {type === "astrophysics" && (
          <Sphere args={[1.8, 64, 64]}>
            <MeshDistortMaterial color="#ef4444" distort={0.3} speed={5} roughness={0.8} />
          </Sphere>
        )}
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 pointer-events-none text-xs text-gray-400 font-mono">
        Left Click + Drag to Rotate • Scroll to Zoom
      </div>
    </div>
  );
}
