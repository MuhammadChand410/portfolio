"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GridBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current!;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    mount.appendChild(renderer.domElement);

    const count = 180;
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.002 + Math.random() * 0.004;
    }
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.04, transparent: true, opacity: 0.5 })));

    for (let i = -6; i <= 6; i++) {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-12, i * 1.1, -2), new THREE.Vector3(12, i * 1.1, -2)]);
      scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.04 })));
    }
    for (let i = -10; i <= 10; i++) {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i * 1.2, -8, -2), new THREE.Vector3(i * 1.2, 8, -2)]);
      scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.04 })));
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= speeds[i];
        if (pos[i * 3 + 1] < -7) pos[i * 3 + 1] = 7;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}
