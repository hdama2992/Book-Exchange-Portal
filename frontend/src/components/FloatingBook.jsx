import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function Book({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#8b5cf6' }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + rotation[1];
    }
  });

  const coverMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1,
  }), [color]);

  const pagesMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f5f5f0',
    roughness: 0.9,
    metalness: 0,
  }), []);

  const spineMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.2,
  }), [color]);

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={meshRef} position={position} rotation={rotation}>
        {/* Front cover */}
        <mesh position={[0, 0, 0.15]} material={coverMaterial}>
          <boxGeometry args={[1.4, 2, 0.05]} />
        </mesh>
        
        {/* Back cover */}
        <mesh position={[0, 0, -0.15]} material={coverMaterial}>
          <boxGeometry args={[1.4, 2, 0.05]} />
        </mesh>
        
        {/* Pages */}
        <mesh position={[0.05, 0, 0]} material={pagesMaterial}>
          <boxGeometry args={[1.25, 1.9, 0.25]} />
        </mesh>
        
        {/* Spine */}
        <mesh position={[-0.7, 0, 0]} material={spineMaterial}>
          <boxGeometry args={[0.08, 2, 0.35]} />
        </mesh>
      </group>
    </Float>
  );
}

function BookStack() {
  const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  
  return (
    <group>
      {/* Main floating book */}
      <Book position={[0, 0.5, 0]} rotation={[0.2, 0.3, 0]} color={colors[0]} />
      
      {/* Secondary books */}
      <Book position={[-2.5, -0.5, -1]} rotation={[0.1, 0.5, 0.1]} color={colors[1]} />
      <Book position={[2.5, 0, -0.5]} rotation={[-0.1, -0.4, 0.05]} color={colors[2]} />
      <Book position={[-1.5, 1.5, -2]} rotation={[0.3, 0.2, -0.1]} color={colors[3]} />
      <Book position={[1.8, -1, -1.5]} rotation={[-0.2, 0.6, 0.15]} color={colors[4]} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ec4899" />
      
      <BookStack />
    </>
  );
}

export default function FloatingBook() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

