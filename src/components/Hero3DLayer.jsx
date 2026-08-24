"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useCanRender3D } from "./three/useCanRender3D";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// The 3D scene is genuinely expensive — narrow viewports (phones/tablets),
// reduced motion, and no-WebGL all fall back to the flat grayscale mark.
// The fallback stays mounted underneath even when 3D is active, and the
// canvas crossfades in on top only once it has actually rendered a first
// frame — swapping them outright caused a visible flash on page load
// (fallback → blank gap while the WebGL chunk loads → canvas).
export default function Hero3DLayer() {
  const canRender3D = useCanRender3D();
  const [instanceKey, setInstanceKey] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const handleContextLost = useCallback(() => {
    setCanvasReady(false);
    setInstanceKey((k) => k + 1);
  }, []);
  const handleReady = useCallback(() => setCanvasReady(true), []);

  return (
    <>
      <img
        src="/ar-mark-white.svg"
        alt=""
        aria-hidden="true"
        className="hero-fallback-mark"
        style={canRender3D ? { opacity: canvasReady ? 0 : undefined, transition: "opacity 0.5s ease" } : undefined}
      />
      {canRender3D && (
        <div style={{ position: "absolute", inset: 0, opacity: canvasReady ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <HeroScene key={instanceKey} onContextLost={handleContextLost} onReady={handleReady} />
        </div>
      )}
    </>
  );
}
