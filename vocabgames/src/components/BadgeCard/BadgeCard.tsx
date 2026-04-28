import type { BadgeDefinition } from '../../types';
import styles from './BadgeCard.module.css';

interface Props {
  badge: BadgeDefinition;
  earned: boolean;
  earnedAt?: string;
}

export function BadgeCard({ badge, earned, earnedAt }: Props) {
  return (
    <div className={`${styles.card} ${earned ? styles.earned : styles.unearned}`}>
      <span className={styles.icon}>{badge.icon}</span>
      <span className={styles.name}>{badge.name}</span>
      <span className={styles.desc}>{badge.description}</span>
      {earnedAt && (
        <span className={styles.date}>{new Date(earnedAt).toLocaleDateString()}</span>
      )}
    </div>
  );
}
