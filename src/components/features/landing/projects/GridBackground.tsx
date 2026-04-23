"use client";

export default function GridBackground() {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${(i % 10) * 10 + Math.random() * 5}%`,
    top: `${Math.floor(i / 10) * 16 + Math.random() * 8}%`,
    duration: `${8 + Math.random() * 8}s`,
    delay: `${Math.random() * 6}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes dot-drift {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-12px); opacity: 0.6; }
        }
      `}</style>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7c3aed" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Floating dots */}
      {dots.map((d) => (
        <div key={d.id} className="absolute w-1 h-1 rounded-full bg-violet-500"
          style={{
            left: d.left, top: d.top, opacity: 0.3,
            animation: `dot-drift ${d.duration} ${d.delay} ease-in-out infinite`,
          }} />
      ))}
    </div>
  );
}
