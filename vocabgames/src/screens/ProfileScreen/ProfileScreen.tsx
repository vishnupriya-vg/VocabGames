import styles from './ProfileScreen.module.css';
import { useGame } from '../../store/useGame';
import { toggleTheme, toggleSound, toggleTimer, resetProfile } from '../../store/actions';
import { BADGES } from '../../data/badges';
import { BadgeCard } from '../../components/BadgeCard/BadgeCard';
import { XPBar } from '../../components/XPBar/XPBar';
import { getXPToNextLevel } from '../../logic/xp';
import { clearProfile } from '../../persistence/localStorage';

export function ProfileScreen() {
  const { state, dispatch } = useGame();
  const { profile } = state;
  const xpProgress = getXPToNextLevel(profile.totalXP);
  const earnedSet = new Set(profile.earnedBadges.map(b => b.badgeId));

  function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      clearProfile();
      dispatch(resetProfile());
    }
  }

  const initials = profile.playerName
    ? profile.playerName.slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className={`screen ${styles.profileScreen}`}>
      {/* Avatar + name */}
      <div className={styles.hero}>
        <div className={styles.avatar}>{initials}</div>
        <h2 className={styles.name}>{profile.playerName || 'Player'}</h2>
        <div className={styles.levelBadge}>Level {profile.currentLevel}</div>
      </div>

      {/* XP progress */}
      <div className={styles.section}>
        <XPBar currentXP={xpProgress.current} requiredXP={xpProgress.required} level={profile.currentLevel} />
        {xpProgress.required > 0 && (
          <p className={styles.xpHint}>{xpProgress.required - xpProgress.current} XP to next level</p>
        )}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{profile.totalXP}</span>
          <span className={styles.statLabel}>Total XP</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{profile.learnedWordIds.length}</span>
          <span className={styles.statLabel}>Words Learned</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{profile.totalSessionsPlayed}</span>
          <span className={styles.statLabel}>Sessions</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{profile.longestStreak} 🔥</span>
          <span className={styles.statLabel}>Best Streak</span>
        </div>
      </div>

      {/* Badges */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Badges</h3>
        <div className={styles.badgeGrid}>
          {BADGES.map(b => (
            <BadgeCard
              key={b.id}
              badge={b}
              earned={earnedSet.has(b.id)}
              earnedAt={profile.earnedBadges.find(e => e.badgeId === b.id)?.earnedAt}
            />
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Settings</h3>
        <div className={styles.settings}>
          <div className={styles.settingRow}>
            <span>Theme</span>
            <button className={styles.toggle} onClick={() => dispatch(toggleTheme())}>
              {profile.settings.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className={styles.settingRow}>
            <span>Sound effects</span>
            <button className={styles.toggle} onClick={() => dispatch(toggleSound())}>
              {profile.settings.soundEnabled ? '🔊 On' : '🔇 Off'}
            </button>
          </div>
          <div className={styles.settingRow}>
            <span>Quiz timer</span>
            <button className={styles.toggle} onClick={() => dispatch(toggleTimer())}>
              {profile.settings.timerEnabled ? '⏱ On' : '⏱ Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className={styles.section}>
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset All Progress
        </button>
      </div>
    </div>
  );
}
