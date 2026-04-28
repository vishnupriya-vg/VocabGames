import styles from './ConfettiOverlay.module.css';

const COLORS = ['#6C63FF', '#FF6584', '#43D18A', '#FFD700', '#4FC3F7', '#FF8A65'];

export function ConfettiOverlay() {
  const pieces = Array.from({ length: 48 }, (_, i) => i);

  return (
    <div className={styles.overlay} aria-hidden="true">
      {pieces.map(i => (
        <div
          key={i}
          className={styles.piece}
          style={{
            left: `${Math.random() * 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.2 + Math.random() * 1.2}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
