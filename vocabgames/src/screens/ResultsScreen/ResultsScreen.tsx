import { useEffect, useState } from 'react';
import styles from './ResultsScreen.module.css';
import { useGame } from '../../store/useGame';
import { navigateTo } from '../../store/actions';
import { ConfettiOverlay } from '../../components/ConfettiOverlay/ConfettiOverlay';
import { BADGES } from '../../data/badges';
import { BadgeCard } from '../../components/BadgeCard/BadgeCard';

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { sessionResult, profile } = state;
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (!sessionResult) return;
    const isPerfect = sessionResult.correctAnswers === sessionResult.totalQuestions;
    if (isPerfect || sessionResult.leveledUp) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    if (sessionResult.leveledUp) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2500);
    }
  }, []);

  if (!sessionResult) {
    dispatch(navigateTo('HOME'));
    return null;
  }

  const { correctAnswers, totalQuestions, xpEarned, newBadges, newLevel } = sessionResult;
  const pct = Math.round((correctAnswers / totalQuestions) * 100);

  const newBadgeDefs = BADGES.filter(b => newBadges.includes(b.id));

  return (
    <div className={`screen ${styles.results}`}>
      {showConfetti && <ConfettiOverlay />}

      {showLevelUp && (
        <div className={styles.levelUpOverlay}>
          <div className={styles.levelUpCard} style={{ animation: 'levelUpBurst 0.5s ease' }}>
            <span className={styles.lvlIcon}>🏆</span>
            <h2>Level Up!</h2>
            <p>You reached Level {newLevel}!</p>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Session Complete!</h1>
      </div>

      {/* Score ring */}
      <div className={styles.scoreSection}>
        <div className={styles.scoreRing}>
          <svg viewBox="0 0 100 100" className={styles.ring}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--xp-gold)' : 'var(--error)'}
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 42 * pct / 100} ${2 * Math.PI * 42 * (1 - pct / 100)}`}
              strokeLinecap="round"
              strokeDashoffset={2 * Math.PI * 42 * 0.25}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div className={styles.scoreInner}>
            <span className={styles.scoreNum}>{correctAnswers}</span>
            <span className={styles.scoreTotal}>/ {totalQuestions}</span>
          </div>
        </div>
        <div className={styles.xpEarned}>
          <span className={styles.xpNum}>+{xpEarned}</span>
          <span className={styles.xpLabel}>XP earned</span>
        </div>
      </div>

      {/* Streak */}
      {profile.currentStreak > 0 && (
        <div className={styles.streakRow}>
          <span>🔥 {profile.currentStreak} day streak!</span>
        </div>
      )}

      {/* New badges */}
      {newBadgeDefs.length > 0 && (
        <div className={styles.badgesSection}>
          <h3 className={styles.sectionTitle}>New Badges 🎉</h3>
          <div className={styles.badgeRow}>
            {newBadgeDefs.map(b => (
              <BadgeCard
                key={b.id}
                badge={b}
                earned={true}
                earnedAt={new Date().toISOString()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.primaryBtn}
          onClick={() => dispatch(navigateTo('MODE_SELECT'))}
        >
          Play Again
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={() => dispatch(navigateTo('LEVEL_MAP'))}
        >
          Back to Map
        </button>
      </div>
    </div>
  );
}
