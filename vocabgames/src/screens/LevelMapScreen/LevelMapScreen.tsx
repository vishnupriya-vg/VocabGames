import styles from './LevelMapScreen.module.css';
import { useGame } from '../../store/useGame';
import { navigateTo, selectLevel, showToast } from '../../store/actions';
import { LevelNode } from '../../components/LevelNode/LevelNode';
import { LEVELS } from '../../data/levels';
import { WORDS } from '../../data/words';

export function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const { profile } = state;

  function handleNodeClick(level: number) {
    const isUnlocked = profile.unlockedLevels.includes(level);
    if (!isUnlocked) {
      const config = LEVELS.find(l => l.level === level)!;
      dispatch(showToast(`Earn ${config.xpRequired} total XP to unlock ${config.name}`));
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2500);
      return;
    }
    dispatch(selectLevel(level));
    dispatch(navigateTo('MODE_SELECT'));
  }

  return (
    <div className={`screen ${styles.mapScreen}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Level Map</h1>
        <p className={styles.subtitle}>{profile.totalXP} XP total</p>
      </div>

      <div className={styles.map}>
        {LEVELS.map((config, i) => {
          const isUnlocked = profile.unlockedLevels.includes(config.level);
          const status =
            config.level === profile.currentLevel
              ? 'current'
              : isUnlocked
              ? 'unlocked'
              : 'locked';

          const wordsLearned = WORDS.filter(
            w => w.level === config.level && profile.learnedWordIds.includes(w.id),
          ).length;

          return (
            <div key={config.level} className={`${styles.row} ${i % 2 === 1 ? styles.offset : ''}`}>
              {i > 0 && <div className={styles.connector} />}
              <LevelNode
                config={config}
                status={status}
                onClick={() => handleNodeClick(config.level)}
                wordsLearned={wordsLearned}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
