"use client";

import { useEffect, useState } from "react";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

// Shared gate for every WebGL section on the page: narrow viewports
// (phones), reduced motion, and no-WebGL all fall back to a flat mark
// instead of paying for a 3D scene.
export function useCanRender3D() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Matches the site's own desktop-nav breakpoint — anything narrower
    // gets the mobile hamburger nav, and should also get the flat fallback
    // mark instead of the 3D scene: the fixed-FOV framing that reads fine
    // on a wide screen looks oversized/cropped on a narrow, tall viewport.
    const wideEnough = window.innerWidth >= 900;
    setCanRender(!prefersReducedMotion && wideEnough && supportsWebGL());
  }, []);

  return canRender;
}
