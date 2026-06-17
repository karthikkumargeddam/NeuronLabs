"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, MeshDistortMaterial } from '@react-three/drei';

function InteractiveNeuron() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh
      ref={meshRef}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClick(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[2, 4]} />
      <MeshDistortMaterial
        color={hovered ? "#22d3ee" : "#8b5cf6"}
        emissive={hovered ? "#0891b2" : "#4c1d95"}
        emissiveIntensity={2}
        distort={0.4}
        speed={3}
        roughness={0.2}
        metalness={0.8}
        wireframe={!clicked}
      />
    </mesh>
  );
}

function DataNodes() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.5;
  });

  return (
    <group ref={groupRef}>
      {[...Array(20)].map((_, i) => {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function WebGLDemoCanvas() {
  return (
    <div className="w-full h-full min-h-[500px] bg-black relative rounded-xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />
        <spotLight position={[-10, -10, -10]} intensity={2} color="#c084fc" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <InteractiveNeuron />
        </Float>
        
        <DataNodes />

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur border border-white/10 p-4 rounded-xl text-white font-mono text-sm pointer-events-none">
        <h3 className="text-cyan-400 font-bold mb-2">Controls</h3>
        <ul className="text-gray-300 space-y-1">
          <li>• Left Click + Drag to Rotate</li>
          <li>• Scroll to Zoom</li>
          <li>• Right Click + Drag to Pan</li>
          <li>• Click the Central Core to expand</li>
        </ul>
      </div>
    </div>
  );
}
