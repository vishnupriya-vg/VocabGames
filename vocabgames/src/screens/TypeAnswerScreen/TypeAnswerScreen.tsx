import { useState, useEffect, useRef } from 'react';
import styles from './TypeAnswerScreen.module.css';
import { useGame } from '../../store/useGame';
import { answerCorrect, answerWrong, navigateTo } from '../../store/actions';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { WORDS } from '../../data/words';
import { calculateXP } from '../../logic/xp';
import { LEVELS } from '../../data/levels';

function normalize(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');
}

function isCloseEnough(input: string, answer: string): boolean {
  const a = normalize(input);
  const b = normalize(answer);
  if (a === b) return true;
  // Allow if input contains 80%+ of the answer words
  const aWords = a.split(' ').filter(Boolean);
  const bWords = b.split(' ').filter(Boolean);
  const common = aWords.filter(w => bWords.some(bw => bw.startsWith(w) || w.startsWith(bw)));
  return common.length >= Math.ceil(bWords.length * 0.7);
}

export function TypeAnswerScreen() {
  const { state, dispatch } = useGame();
  const { sessionWordIds, currentQuestionIndex, profile, selectedLevel } = state;

  const levelConfig = LEVELS.find(l => l.level === selectedLevel);
  const currentWordId = sessionWordIds[currentQuestionIndex];
  const currentWord = WORDS.find(w => w.id === currentWordId);

  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setInput('');
    setFeedback('idle');
    startTimeRef.current = Date.now();
    inputRef.current?.focus();
  }, [currentWordId]);

  if (!currentWord) return null;

  function handleSubmit() {
    if (!currentWord || feedback !== 'idle') return;
    const correct = isCloseEnough(input, currentWord.meaning);
    setFeedback(correct ? 'correct' : 'wrong');

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const fast = elapsed < 8;

    setTimeout(() => {
      if (correct) {
        const xp = calculateXP(currentWord.difficulty, profile.currentStreak, fast);
        dispatch(answerCorrect(currentWord.id, xp, fast));
      } else {
        dispatch(answerWrong(currentWord.id));
      }
    }, 1000);
  }

  return (
    <div className={`screen ${styles.typeScreen}`}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch(navigateTo('MODE_SELECT'))}>←</button>
        <span className={styles.progress}>{currentQuestionIndex + 1} / {sessionWordIds.length}</span>
        <StreakBadge streak={profile.currentStreak} />
      </div>

      <p className={styles.levelTag}>{levelConfig?.name}</p>

      <div className={styles.wordBox}>
        <span className={styles.pos}>{currentWord.partOfSpeech}</span>
        <h2 className={styles.word}>{currentWord.word}</h2>
        <p className={styles.hint}><em>{currentWord.exampleSentence.replace(currentWord.word, '_____')}</em></p>
      </div>

      <div className={`${styles.inputArea} ${styles[feedback]}`}>
        <label className={styles.inputLabel}>Type the meaning:</label>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Type here…"
          disabled={feedback !== 'idle'}
        />
        {feedback === 'correct' && (
          <p className={styles.feedbackMsg}>✓ Correct! {currentWord.meaning}</p>
        )}
        {feedback === 'wrong' && (
          <p className={styles.feedbackMsg}>✗ The answer was: <strong>{currentWord.meaning}</strong></p>
        )}
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!input.trim() || feedback !== 'idle'}
      >
        Submit
      </button>
    </div>
  );
}
