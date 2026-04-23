"use client";

export default function ParticleBackground() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1.5 + Math.random() * 2}px`,
    duration: `${6 + Math.random() * 10}s`,
    delay: `${Math.random() * 8}s`,
    opacity: 0.2 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: var(--op); }
          33% { transform: translateY(-20px) translateX(8px); opacity: calc(var(--op) * 1.5); }
          66% { transform: translateY(-10px) translateX(-6px); opacity: calc(var(--op) * 0.7); }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-violet-500"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            "--op": p.opacity,
            opacity: p.opacity,
            animation: `particle-float ${p.duration} ${p.delay} ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
