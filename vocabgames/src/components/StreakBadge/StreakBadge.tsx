import styles from './StreakBadge.module.css';

interface Props { streak: number; }

export function StreakBadge({ streak }: Props) {
  return (
    <div className={`${styles.badge} ${streak > 0 ? styles.active : ''}`}>
      <span className={styles.icon}>🔥</span>
      <span className={styles.count}>{streak}</span>
    </div>
  );
}
