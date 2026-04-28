import { useEffect } from 'react';
import styles from './FlashcardScreen.module.css';
import { useGame } from '../../store/useGame';
import { answerCorrect, answerWrong, navigateTo } from '../../store/actions';
import { Flashcard } from '../../components/Flashcard/Flashcard';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { WORDS } from '../../data/words';
import { calculateXP } from '../../logic/xp';
import { LEVELS } from '../../data/levels';

export function FlashcardScreen() {
  const { state, dispatch } = useGame();
  const { sessionWordIds, currentQuestionIndex, profile, selectedLevel } = state;

  const levelConfig = LEVELS.find(l => l.level === selectedLevel);
  const currentWordId = sessionWordIds[currentQuestionIndex];
  const currentWord = WORDS.find(w => w.id === currentWordId);

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') handleKnow();
      if (e.key === 'ArrowLeft') handleSkip();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!currentWord) {
    return (
      <div className={styles.empty}>
        <p>No words available for this level.</p>
        <button onClick={() => dispatch(navigateTo('LEVEL_MAP'))}>Back</button>
      </div>
    );
  }

  function handleKnow() {
    if (!currentWord) return;
    const xp = calculateXP(currentWord.difficulty, profile.currentStreak, false);
    dispatch(answerCorrect(currentWord.id, xp, false));
  }

  function handleSkip() {
    if (!currentWord) return;
    dispatch(answerWrong(currentWord.id));
  }

  const progress = `${currentQuestionIndex + 1} / ${sessionWordIds.length}`;

  return (
    <div className={`screen ${styles.flashcardScreen}`}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch(navigateTo('MODE_SELECT'))}>←</button>
        <span className={styles.levelName}>{levelConfig?.name}</span>
        <StreakBadge streak={profile.currentStreak} />
      </div>

      <Flashcard
        word={currentWord}
        onKnow={handleKnow}
        onSkip={handleSkip}
        progress={progress}
      />
    </div>
  );
}
