"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function OrbBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current!;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H); renderer.setPixelRatio(1);
    mount.appendChild(renderer.domElement);

    const orbData: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];
    const orbColors = [0x7c3aed, 0x06b6d4, 0xa78bfa, 0x4c1d95, 0x0e7490];
    for (let i = 0; i < 12; i++) {
      const r = 0.15 + Math.random() * 0.35;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: orbColors[i % orbColors.length], transparent: true, opacity: 0.06 + Math.random() * 0.08 })
      );
      mesh.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 4);
      scene.add(mesh);
      orbData.push({ mesh, speed: 0.003 + Math.random() * 0.005, offset: Math.random() * Math.PI * 2 });
    }

    const starCount = 300;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 30;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.3 })));

    orbData.forEach((a, i) => {
      if (i % 3 !== 0) return;
      const b = orbData[(i + 3) % orbData.length];
      const curve = new THREE.QuadraticBezierCurve3(a.mesh.position.clone(), new THREE.Vector3(0, 0, 0), b.mesh.position.clone());
      const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
      scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.05 })));
    });

    let t = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.01;
      orbData.forEach(({ mesh, speed, offset }) => {
        mesh.position.y += Math.sin(t * speed * 60 + offset) * 0.003;
        mesh.position.x += Math.cos(t * speed * 40 + offset) * 0.002;
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}
