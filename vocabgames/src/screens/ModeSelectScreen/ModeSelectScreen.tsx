import styles from './ModeSelectScreen.module.css';
import { useGame } from '../../store/useGame';
import { navigateTo, selectMode, startSession } from '../../store/actions';
import type { GameMode } from '../../types';
import { LEVELS } from '../../data/levels';
import { getSessionWords } from '../../logic/flashcard';

const MODES: { mode: GameMode; icon: string; name: string; desc: string }[] = [
  { mode: 'word-match', icon: '🔗', name: 'Word Match',       desc: 'Find the two related words among 6 cards' },
  { mode: 'quiz',       icon: '🧠', name: 'Multiple Choice',  desc: '4-option quiz with instant feedback' },
  { mode: 'fill-blank', icon: '✍️',  name: 'Fill in the Blank', desc: 'Choose the word that fits the sentence' },
];

export function ModeSelectScreen() {
  const { state, dispatch } = useGame();
  const { selectedLevel, profile, contentMode } = state;
  const levelConfig = LEVELS.find(l => l.level === selectedLevel)!;

  function handleStart(mode: GameMode) {
    const sessionWords = getSessionWords(selectedLevel, profile.learnedWordIds, contentMode, 10);
    dispatch(selectMode(mode));
    dispatch(startSession(sessionWords.map(w => w.id)));
    const screen = mode === 'word-match' ? 'WORD_MATCH' : mode === 'quiz' ? 'QUIZ' : 'FILL_BLANK';
    dispatch(navigateTo(screen));
  }

  return (
    <div className={`screen ${styles.modeSelect}`}>
      <button className={styles.back} onClick={() => dispatch(navigateTo('LEVEL_MAP'))}>
        ← Back
      </button>

      <div className={styles.levelInfo}>
        <span className={styles.icon}>{levelConfig.icon}</span>
        <h2 className={styles.levelName}>{levelConfig.name}</h2>
        <p className={styles.levelNum}>Level {selectedLevel}</p>
      </div>

      <div className={styles.modes}>
        {MODES.map(m => (
          <button
            key={m.mode}
            className={styles.modeCard}
            onClick={() => handleStart(m.mode)}
          >
            <span className={styles.modeIcon}>{m.icon}</span>
            <div>
              <p className={styles.modeName}>{m.name}</p>
              <p className={styles.modeDesc}>{m.desc}</p>
            </div>
            <span className={styles.arrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
