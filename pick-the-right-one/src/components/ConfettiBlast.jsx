import { useState } from 'react';

const COLORS = ['#534AB7', '#1D9E75', '#E24B4A', '#EF9F27', '#FF6B9D', '#4ECDC4'];

export default function ConfettiBlast() {
  const [pieces] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.6,
      duration: 1.4 + Math.random() * 1.2,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }))
  );

  return (
    <div className="confetti-overlay" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
