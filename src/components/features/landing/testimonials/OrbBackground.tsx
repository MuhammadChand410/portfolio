"use client";

const ORBS = [
  { w: 300, h: 300, top: "10%", left: "5%", color: "rgba(124,58,237,0.07)", dur: "12s", delay: "0s" },
  { w: 200, h: 200, top: "60%", left: "80%", color: "rgba(6,182,212,0.06)", dur: "15s", delay: "2s" },
  { w: 250, h: 250, top: "30%", left: "60%", color: "rgba(167,139,250,0.05)", dur: "10s", delay: "1s" },
  { w: 180, h: 180, top: "70%", left: "20%", color: "rgba(76,29,149,0.07)", dur: "18s", delay: "3s" },
  { w: 220, h: 220, top: "5%", left: "70%", color: "rgba(14,116,144,0.06)", dur: "14s", delay: "0.5s" },
];

export default function OrbBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes orb-float {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(15px,-12px); }
        }
      `}</style>
      {ORBS.map((o, i) => (
        <div key={i} className="absolute rounded-full blur-3xl"
          style={{
            width: o.w, height: o.h,
            top: o.top, left: o.left,
            background: o.color,
            willChange: "transform",
            animation: `orb-float ${o.dur} ${o.delay} ease-in-out infinite`,
          }} />
      ))}
    </div>
  );
}
