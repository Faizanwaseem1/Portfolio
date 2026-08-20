'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function DistortedTile({ accent }: { accent: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;

    const material = mesh.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uPointer.value.set(pointer.x, pointer.y);

    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, pointer.x * 0.22, 0.05);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, pointer.y * 0.18, 0.05);
  });

  return (
    <mesh ref={mesh} rotation={[0.1, -0.22, 0]}>
      <planeGeometry args={[3.1, 2.1, 120, 120]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uColor: { value: color },
        }}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uPointer;
          varying vec2 vUv;
          varying float vNoise;

          void main() {
            vUv = uv;
            vec3 p = position;
            float wave = sin((uv.x + uv.y) * 16.0 + uTime * 1.6) * 0.2;
            float pulse = sin((uv.y * 18.0 - uTime * 1.3) + length(uv - vec2(0.5)) * 20.0) * 0.16;
            float drag = (1.0 - smoothstep(0.0, 1.2, length(uv - (uPointer * 0.5 + 0.5)))) * 0.2;
            p.z += wave + pulse + drag;
            vNoise = wave + pulse + drag;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uPointer;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying float vNoise;

          void main() {
            vec2 uv = vUv;
            vec2 centered = uv - vec2(0.5);
            float soft = 1.0 - smoothstep(0.0, 1.2, length(centered));
            float shimmer = sin((uv.x * 18.0 + uv.y * 14.0 + uTime) * 1.2) * 0.5 + 0.5;
            vec3 base = mix(vec3(0.96, 0.95, 0.92), uColor, 0.55);
            vec3 highlight = vec3(0.92, 0.94, 0.98);
            vec3 finalColor = mix(base, highlight, shimmer * 0.7 + soft * 0.3);
            finalColor += vec3(0.56, 0.62, 0.7) * (0.12 + vNoise * 0.2);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function ProjectPreviewWebGL({ accent }: { accent: string }) {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-[1.5rem] border border-[#bfb7ae] bg-[#f5f1e9]">
      <Canvas camera={{ position: [0, 0, 3], fov: 30 }} dpr={[1, 2]}>
        <ambientLight intensity={0.9} />
        <DistortedTile accent={accent} />
      </Canvas>
    </div>
  );
}
