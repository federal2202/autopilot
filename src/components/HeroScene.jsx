"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMonogramGeometries } from "./three/useMonogramGeometries";

const POINT_COUNT = 900;

function Monogram({ pointer }) {
  const geometries = useMonogramGeometries();
  const group = useRef(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.16;
    const targetX = pointer.current.y * 0.3;
    const targetZ = -pointer.current.x * 0.22;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetZ, 4, delta);
  });

  return (
    <group ref={group}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial color="#eeeeec" metalness={0.9} roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ pointer }) {
  const ref = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.015;
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, pointer.current.x * 0.4, 3, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, pointer.current.y * 0.4, 3, delta);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f2f2f0" size={0.028} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

function ScrollRig({ scrollRef, children }) {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const progress = scrollRef.current;
    const targetZ = 6 - progress * 2.2;
    const targetY = progress * -0.6;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta);
    camera.lookAt(0, 0, 0);
  });

  return children;
}

export default function HeroScene({ onContextLost, onReady }) {
  const pointer = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);

    const onMove = (e) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", onMove);

    const onScroll = () => {
      scrollProgress.current = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!ready) return null;

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={(state) => {
        // Browsers can silently drop the WebGL context on a canvas that's
        // been scrolled off-screen for a while (GPU memory pressure, tab
        // backgrounding) — it never comes back on its own, so force a full
        // remount from the parent instead of trying to restore in place.
        state.gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost?.();
          },
          false
        );
        onReady?.();
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#8a8a8a" />
      <ScrollRig scrollRef={scrollProgress}>
        <Monogram pointer={pointer} />
        <ParticleField pointer={pointer} />
      </ScrollRig>
    </Canvas>
  );
}
