import type { LevelConfig } from '../../types';
import styles from './LevelNode.module.css';

interface Props {
  config: LevelConfig;
  status: 'locked' | 'unlocked' | 'current';
  onClick: () => void;
  wordsLearned: number;
}

export function LevelNode({ config, status, onClick, wordsLearned }: Props) {
  const pct = Math.min(Math.round((wordsLearned / config.wordCount) * 100), 100);

  return (
    <div className={`${styles.wrapper} ${styles[status]}`}>
      <button
        className={styles.node}
        style={status !== 'locked' ? { borderColor: config.color } : undefined}
        onClick={onClick}
        disabled={status === 'locked'}
        aria-label={`Level ${config.level}: ${config.name}. ${status === 'locked' ? 'Locked' : 'Available'}`}
      >
        <span className={styles.icon}>{status === 'locked' ? '🔒' : config.icon}</span>
      </button>
      <div className={styles.info}>
        <span className={styles.name}>{config.name}</span>
        <span className={styles.level}>Level {config.level}</span>
        {status !== 'locked' && (
          <span className={styles.pct}>{pct}% mastered</span>
        )}
        {status === 'locked' && (
          <span className={styles.xpReq}>{config.xpRequired} XP to unlock</span>
        )}
      </div>
    </div>
  );
}
