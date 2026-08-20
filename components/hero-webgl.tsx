'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function LiquidPearl() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (!mesh.current) return;

    const material = mesh.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = t;
    material.uniforms.uPointer.value.set(pointer.x, pointer.y);

    mesh.current.position.x = pointer.x * 0.18;
    mesh.current.position.y = pointer.y * 0.12;
    mesh.current.rotation.z = pointer.x * 0.3;
  });

  return (
    <mesh ref={mesh} rotation={[0.2, 0.4, 0]}>
      <planeGeometry args={[8.8, 5.2, 128, 128]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        }}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uPointer;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            vUv = uv;
            vec3 p = position;
            float wave = sin((uv.x * 12.0 + uTime * 0.7) + uv.y * 9.0) * 0.13;
            float ripple = sin(length(uv - vec2(0.5, 0.5)) * 20.0 - uTime * 1.4) * 0.08;
            float pointerInfluence = length(uv - (uPointer * 0.5 + 0.5));
            p.z += wave + ripple + (1.0 - pointerInfluence) * 0.22;
            vWave = wave + ripple;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uPointer;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            vec2 uv = vUv;
            vec2 centered = uv - vec2(0.5);
            float dist = length(centered);
            float glow = 1.0 - smoothstep(0.0, 1.1, dist);
            float shimmer = sin((uv.x + uv.y) * 18.0 + uTime * 1.4) * 0.5 + 0.5;
            vec3 pearlA = vec3(0.96, 0.95, 0.93);
            vec3 pearlB = vec3(0.85, 0.88, 0.95);
            vec3 pearlC = vec3(0.72, 0.76, 0.82);
            vec3 color = mix(pearlA, pearlB, uv.y + vWave * 0.7);
            color = mix(color, pearlC, smoothstep(0.35, 1.0, dist + shimmer * 0.2));
            color += glow * vec3(0.72, 0.78, 0.84) * 0.32;
            color += 0.12 * vec3(0.9, 0.92, 0.97) * (0.5 + sin(uTime + uv.x * 14.0) * 0.5);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function HeroWebGL() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }} dpr={[1, 2]}>
        <LiquidPearl />
      </Canvas>
    </div>
  );
}
