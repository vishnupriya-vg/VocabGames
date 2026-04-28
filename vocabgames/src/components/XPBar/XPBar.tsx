import styles from './XPBar.module.css';

interface Props {
  currentXP: number;
  requiredXP: number;
  level: number;
  compact?: boolean;
}

export function XPBar({ currentXP, requiredXP, level, compact }: Props) {
  const pct = requiredXP > 0 ? Math.min((currentXP / requiredXP) * 100, 100) : 100;

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
      <div className={styles.label}>
        <span className={styles.levelBadge}>Lv {level}</span>
        {!compact && (
          <span className={styles.xpText}>
            {currentXP} / {requiredXP > 0 ? requiredXP : '∞'} XP
          </span>
        )}
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
