"use client";

const DOTS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 7 + 3) % 100}%`,
  top: `${(i * 11 + 5) % 100}%`,
  dur: `${8 + (i % 5) * 2}s`,
  delay: `${(i % 6) * 1.1}s`,
}));

export default function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes dd { 0%,100% { transform:translateY(0); opacity:.3; } 50% { transform:translateY(-10px); opacity:.55; } }
      `}</style>
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7c3aed" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {DOTS.map((d) => (
        <div key={d.id} className="absolute w-1 h-1 rounded-full bg-violet-500"
          style={{
            left: d.left, top: d.top, opacity: 0.3,
            willChange: "transform",
            animation: `dd ${d.dur} ${d.delay} ease-in-out infinite`,
          }} />
      ))}
    </div>
  );
}
