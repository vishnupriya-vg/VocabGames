import { useEffect, useRef, useState } from 'react';
import './ConfettiBlast.css';

const COLORS = ['#f72585','#4cc9f0','#4361ee','#7209b7','#06d6a0','#fb8500','#ffbe0b'];
const COUNT  = 70;

function makeParticles() {
  return Array.from({ length: COUNT }, (_, id) => {
    const angle    = Math.random() * Math.PI * 2;
    const dist     = Math.random() * 220 + 80;
    return {
      id,
      color:    COLORS[id % COLORS.length],
      dx:       Math.cos(angle) * dist,
      dy:       Math.sin(angle) * dist - 60, // slight upward bias
      rotation: Math.random() * 720 - 360,
      size:     Math.random() * 7 + 6,
      delay:    Math.random() * 0.25,
      dur:      Math.random() * 0.6 + 0.9,
      round:    Math.random() > 0.45,
    };
  });
}

export default function ConfettiBlast({ active }) {
  const [particles, setParticles] = useState([]);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    setParticles(makeParticles());
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setParticles([]), 2400);
  }, [active]);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-root" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            width:          p.size,
            height:         p.round ? p.size : p.size * 0.45,
            background:     p.color,
            borderRadius:   p.round ? '50%' : '1px',
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
            '--dx':         `${p.dx}px`,
            '--dy':         `${p.dy}px`,
            '--rot':        `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
