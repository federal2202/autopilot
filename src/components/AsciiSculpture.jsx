"use client";

import { useEffect, useRef } from "react";
import { cameraAscii } from "@/data/asciiCameraData";

const RAMP = [" ", ".", ":", "+", "*", "%", "#", "@"];
const THRESHOLD = 0.86;
const COLOR = [244, 245, 246]; // --fg (white)

export default function AsciiSculpture({ className, cell = 6.5 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { cols, rows, pixels } = cameraAscii;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Backing-store resolution only — display size is owned entirely by CSS
    // (width/height:auto on .hero-sculpture) so the canvas scales responsively.
    canvas.width = cols * cell * dpr;
    canvas.height = rows * cell * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cols * cell, rows * cell);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${cell * 1.25}px "SFMono-Regular", ui-monospace, Menlo, monospace`;

    const [cr, cg, cb] = COLOR;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lum = pixels[y * cols + x] / 255;
        if (lum >= THRESHOLD) continue;
        const density = Math.max(0, Math.min(1, 1 - lum / THRESHOLD));
        const idx = Math.min(RAMP.length - 1, Math.round(density * (RAMP.length - 1)));
        const ch = RAMP[idx];
        if (ch === " ") continue;
        const opacity = 0.25 + 0.75 * density;
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${opacity})`;
        ctx.fillText(ch, x * cell + cell / 2, y * cell + cell / 2);
      }
    }
  }, [cell]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
