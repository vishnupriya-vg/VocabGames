import { useState, useEffect } from 'react';
import styles from './WordMatchScreen.module.css';
import { useGame } from '../../store/useGame';
import { answerCorrect, answerWrong, navigateTo } from '../../store/actions';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { WORDS } from '../../data/words';
import { calculateXP } from '../../logic/xp';
import { LEVELS } from '../../data/levels';
import { shuffle, getDistractors } from '../../logic/flashcard';

interface MatchCard {
  id: string;
  text: string;
  isTarget: boolean;
  isMatch: boolean;
}

type CardState = 'idle' | 'selected' | 'correct' | 'wrong';

export function WordMatchScreen() {
  const { state, dispatch } = useGame();
  const { sessionWordIds, currentQuestionIndex, profile, selectedLevel } = state;

  const levelConfig = LEVELS.find(l => l.level === selectedLevel);
  const currentWordId = sessionWordIds[currentQuestionIndex];
  const currentWord = WORDS.find(w => w.id === currentWordId);

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [xpFloat, setXpFloat] = useState<string | null>(null);
  const [relationship, setRelationship] = useState<'synonym' | 'antonym'>('synonym');

  useEffect(() => {
    if (!currentWord) return;

    // Pick a related word: prefer antonym for variety, fall back to synonym
    let matchText = '';
    let rel: 'synonym' | 'antonym' = 'synonym';

    if (currentWord.antonyms && currentWord.antonyms.length > 0) {
      matchText = currentWord.antonyms[Math.floor(Math.random() * currentWord.antonyms.length)];
      rel = 'antonym';
    } else if (currentWord.synonyms.length > 0) {
      matchText = currentWord.synonyms[Math.floor(Math.random() * currentWord.synonyms.length)];
      rel = 'synonym';
    } else {
      matchText = currentWord.meaning.split(' ').slice(0, 2).join(' ');
    }

    setRelationship(rel);

    const distractors = getDistractors(currentWord, WORDS, 4);

    const newCards: MatchCard[] = shuffle([
      { id: 'target', text: currentWord.word, isTarget: true, isMatch: false },
      { id: 'match', text: matchText, isTarget: false, isMatch: true },
      ...distractors.map((w, i) => ({
        id: `dist-${i}`,
        text: w.word,
        isTarget: false,
        isMatch: false,
      })),
    ]);

    const initStates: Record<string, CardState> = {};
    newCards.forEach(c => { initStates[c.id] = 'idle'; });

    setCards(newCards);
    setCardStates(initStates);
    setSelectedIds([]);
    setWrongAttempts(0);
    setLocked(false);
  }, [currentWordId]);

  if (!currentWord) {
    return (
      <div className={styles.empty}>
        <p>No words available for this level.</p>
        <button onClick={() => dispatch(navigateTo('LEVEL_MAP'))}>Back</button>
      </div>
    );
  }

  function handleCardTap(cardId: string) {
    if (!currentWord || locked || cardStates[cardId] === 'correct') return;

    if (selectedIds.includes(cardId)) {
      // Deselect
      setSelectedIds(prev => prev.filter(id => id !== cardId));
      setCardStates(prev => ({ ...prev, [cardId]: 'idle' }));
      return;
    }

    const newSelected = [...selectedIds, cardId];
    setCardStates(prev => ({ ...prev, [cardId]: 'selected' }));

    if (newSelected.length === 2) {
      setLocked(true);
      const [a, b] = newSelected.map(id => cards.find(c => c.id === id)!);
      const isCorrect = (a.isTarget && b.isMatch) || (a.isMatch && b.isTarget);

      if (isCorrect) {
        setCardStates(prev => ({
          ...prev,
          [newSelected[0]]: 'correct',
          [newSelected[1]]: 'correct',
        }));
        const xp = calculateXP(currentWord.difficulty, profile.currentStreak, false);
        setXpFloat(`+${xp} XP`);
        setTimeout(() => setXpFloat(null), 900);
        setTimeout(() => {
          dispatch(answerCorrect(currentWord.id, xp, false));
        }, 900);
      } else {
        setCardStates(prev => ({
          ...prev,
          [newSelected[0]]: 'wrong',
          [newSelected[1]]: 'wrong',
        }));

        const newAttempts = wrongAttempts + 1;
        setWrongAttempts(newAttempts);

        setTimeout(() => {
          if (newAttempts >= 2) {
            dispatch(answerWrong(currentWord.id));
          } else {
            // Reset for retry
            setCardStates(prev => {
              const reset = { ...prev };
              newSelected.forEach(id => { reset[id] = 'idle'; });
              return reset;
            });
            setSelectedIds([]);
            setLocked(false);
          }
        }, 800);
      }
    } else {
      setSelectedIds(newSelected);
    }
  }

  const hint = relationship === 'antonym' ? 'Find the antonym pair' : 'Find the synonym pair';

  return (
    <div className={`screen ${styles.wordMatch}`}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch(navigateTo('MODE_SELECT'))}>←</button>
        <span className={styles.progress}>{currentQuestionIndex + 1} / {sessionWordIds.length}</span>
        <StreakBadge streak={profile.currentStreak} />
      </div>

      <div className={styles.levelTag}>{levelConfig?.name}</div>

      <div className={styles.instruction}>
        <p className={styles.hint}>{hint}</p>
        <p className={styles.subHint}>Tap two cards that are related</p>
      </div>

      <div className={styles.grid}>
        {cards.map(card => (
          <button
            key={card.id}
            className={`${styles.card} ${styles[cardStates[card.id] ?? 'idle']}`}
            onClick={() => handleCardTap(card.id)}
            disabled={locked && cardStates[card.id] !== 'correct'}
          >
            {card.text}
          </button>
        ))}
      </div>

      {wrongAttempts > 0 && wrongAttempts < 2 && (
        <p className={styles.tryAgain}>Try again! ({2 - wrongAttempts} attempt left)</p>
      )}

      {xpFloat && <div className={styles.xpFloat}>{xpFloat}</div>}
    </div>
  );
}
