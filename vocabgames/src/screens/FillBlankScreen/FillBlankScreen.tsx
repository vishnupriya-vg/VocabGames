import { useState, useEffect, useRef } from 'react';
import styles from './FillBlankScreen.module.css';
import { useGame } from '../../store/useGame';
import { answerCorrect, answerWrong, navigateTo } from '../../store/actions';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { WORDS } from '../../data/words';
import { calculateXP } from '../../logic/xp';
import { LEVELS } from '../../data/levels';
import { shuffle } from '../../logic/flashcard';

function buildBlankSentence(sentence: string, word: string): string {
  // Replace the word (case-insensitive, whole word) with a blank
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return sentence.replace(new RegExp(`\\b${escaped}\\b`, 'i'), '_____');
}

export function FillBlankScreen() {
  const { state, dispatch } = useGame();
  const { sessionWordIds, currentQuestionIndex, profile, selectedLevel } = state;

  const levelConfig = LEVELS.find(l => l.level === selectedLevel);
  const currentWordId = sessionWordIds[currentQuestionIndex];
  const currentWord = WORDS.find(w => w.id === currentWordId);

  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [xpFloat, setXpFloat] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!currentWord) return;

    // 3 distractors from same level (or any level if not enough)
    const pool = WORDS.filter(w => w.id !== currentWord.id && w.level === currentWord.level);
    const fallback = WORDS.filter(w => w.id !== currentWord.id && w.level !== currentWord.level);
    const distractorPool = pool.length >= 3 ? pool : [...pool, ...fallback];
    const distractors = shuffle(distractorPool).slice(0, 3).map(w => w.word);

    setOptions(shuffle([currentWord.word, ...distractors]));
    setSelected(null);
    startTimeRef.current = Date.now();
  }, [currentWordId]);

  if (!currentWord) return null;

  const correctIndex = options.indexOf(currentWord.word);
  const sentence = buildBlankSentence(currentWord.exampleSentence, currentWord.word);

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);

    const isCorrect = idx === correctIndex;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const fast = elapsed < 5;

    if (isCorrect) {
      const xp = calculateXP(currentWord!.difficulty, profile.currentStreak, fast);
      setXpFloat(`+${xp} XP${fast ? ' ⚡' : ''}`);
      setTimeout(() => setXpFloat(null), 900);
      setTimeout(() => {
        dispatch(answerCorrect(currentWord!.id, xp, fast));
      }, 900);
    } else {
      setTimeout(() => {
        dispatch(answerWrong(currentWord!.id));
      }, 900);
    }
  }

  function getOptionState(idx: number): 'idle' | 'correct' | 'wrong' | 'reveal' {
    if (selected === null) return 'idle';
    if (idx === correctIndex) return selected === idx ? 'correct' : 'reveal';
    if (idx === selected) return 'wrong';
    return 'idle';
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className={`screen ${styles.fillBlank}`}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch(navigateTo('MODE_SELECT'))}>←</button>
        <span className={styles.progress}>{currentQuestionIndex + 1} / {sessionWordIds.length}</span>
        <StreakBadge streak={profile.currentStreak} />
      </div>

      <div className={styles.levelTag}>{levelConfig?.name}</div>

      <div className={styles.questionBox}>
        <p className={styles.prompt}>Choose the word that fits the blank:</p>
        <div className={styles.sentence}>{sentence}</div>
        <div className={styles.wordInfo}>
          <span className={styles.pos}>{currentWord.partOfSpeech}</span>
          <span className={styles.meaning}>{currentWord.meaning}</span>
        </div>
      </div>

      <div className={styles.options}>
        {options.map((opt, idx) => {
          const st = getOptionState(idx);
          return (
            <button
              key={idx}
              className={`${styles.option} ${styles[st]}`}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
            >
              <span className={styles.label}>{optionLabels[idx]}</span>
              <span className={styles.optText}>{opt}</span>
            </button>
          );
        })}
      </div>

      {xpFloat && <div className={styles.xpFloat}>{xpFloat}</div>}
    </div>
  );
}
