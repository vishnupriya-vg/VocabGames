import { useState, useEffect, useRef } from 'react';
import styles from './QuizScreen.module.css';
import { useGame } from '../../store/useGame';
import { answerCorrect, answerWrong, navigateTo } from '../../store/actions';
import { QuizOption } from '../../components/QuizOption/QuizOption';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { WORDS } from '../../data/words';
import { generateQuizQuestion, type QuizQuestion } from '../../logic/quiz';
import { calculateXP } from '../../logic/xp';
import { LEVELS } from '../../data/levels';

export function QuizScreen() {
  const { state, dispatch } = useGame();
  const { sessionWordIds, currentQuestionIndex, profile, selectedLevel } = state;

  const levelConfig = LEVELS.find(l => l.level === selectedLevel);
  const currentWordId = sessionWordIds[currentQuestionIndex];
  const currentWord = WORDS.find(w => w.id === currentWordId);

  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [speedEligible, setSpeedEligible] = useState(true);
  const startTimeRef = useRef(Date.now());
  const [xpFloat, setXpFloat] = useState<string | null>(null);

  useEffect(() => {
    if (currentWord) {
      setQuestion(generateQuizQuestion(currentWord));
      setSelected(null);
      setSpeedEligible(true);
      startTimeRef.current = Date.now();
    }
  }, [currentWordId, currentWord]);

  // Keyboard 1–4 for options
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selected !== null) return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx !== -1 && question) handleSelect(idx);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!currentWord || !question) return null;

  function handleSelect(idx: number) {
    if (selected !== null || !question || !currentWord) return;
    setSelected(idx);
    const isCorrect = idx === question.correctIndex;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const fast = speedEligible && elapsed < 5;

    if (isCorrect) {
      const xp = calculateXP(currentWord.difficulty, profile.currentStreak, fast);
      setXpFloat(`+${xp} XP${fast ? ' ⚡' : ''}`);
      setTimeout(() => setXpFloat(null), 900);
      setTimeout(() => {
        dispatch(answerCorrect(currentWord.id, xp, fast));
      }, 800);
    } else {
      setTimeout(() => {
        dispatch(answerWrong(currentWord.id));
      }, 800);
    }
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  function getOptionState(idx: number) {
    if (selected === null) return 'idle';
    if (idx === question!.correctIndex) return selected === idx ? 'correct' : 'reveal';
    if (idx === selected) return 'wrong';
    return 'idle';
  }

  // Timer bar
  const timerEnabled = profile.settings.timerEnabled;

  return (
    <div className={`screen ${styles.quizScreen}`}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch(navigateTo('MODE_SELECT'))}>←</button>
        <span className={styles.progress}>{currentQuestionIndex + 1} / {sessionWordIds.length}</span>
        <StreakBadge streak={profile.currentStreak} />
      </div>

      {timerEnabled && selected === null && (
        <div className={styles.timerTrack}>
          <div
            className={styles.timerFill}
            style={{ animation: 'timerDrain 15s linear forwards' }}
          />
        </div>
      )}

      <div className={styles.levelTag}>{levelConfig?.name}</div>

      <div className={styles.questionBox}>
        <p className={styles.prompt}>What does</p>
        <h2 className={styles.word}>{question.word.word}</h2>
        <p className={styles.prompt}>mean?</p>
      </div>

      <div className={styles.options}>
        {question.options.map((opt, idx) => (
          <QuizOption
            key={idx}
            text={opt}
            label={optionLabels[idx]}
            state={getOptionState(idx)}
            onClick={() => handleSelect(idx)}
            disabled={selected !== null}
          />
        ))}
      </div>

      {xpFloat && (
        <div className={styles.xpFloat}>{xpFloat}</div>
      )}
    </div>
  );
}
