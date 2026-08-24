"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

// Extrudes the AR mark's SVG paths into normalized, centered 3D geometries
// (unit scale ~2.6) shared by the hero mark and the walkthrough fragments,
// so both read as the same physical object.
export function useMonogramGeometries(depth = 140) {
  const svgData = useLoader(SVGLoader, "/ar-mark.svg");

  return useMemo(() => {
    const shapes = svgData.paths.flatMap((path) => SVGLoader.createShapes(path));
    const geoms = shapes.map((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 8,
        bevelSize: 8,
        bevelSegments: 4,
        curveSegments: 20,
      });
      geo.scale(1, -1, 1);
      return geo;
    });

    const box = new THREE.Box3();
    geoms.forEach((g) => {
      g.computeBoundingBox();
      box.union(g.boundingBox);
    });
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const scale = 2.6 / Math.max(size.x, size.y, size.z);
    geoms.forEach((g) => {
      g.translate(-center.x, -center.y, -center.z);
      g.scale(scale, scale, scale);
      g.computeVertexNormals();
    });
    return geoms;
  }, [svgData, depth]);
}
