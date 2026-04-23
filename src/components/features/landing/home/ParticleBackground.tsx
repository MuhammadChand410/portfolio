"use client";

// Static — defined once, never causes re-render or reflow
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: `${1.5 + (i % 3) * 0.8}px`,
  duration: `${8 + (i % 5) * 2}s`,
  delay: `${(i % 7) * 1.2}s`,
  opacity: 0.15 + (i % 4) * 0.08,
}));

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes pf {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-violet-500"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            willChange: "transform",
            animation: `pf ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
