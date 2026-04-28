import { useState, useEffect } from 'react';
import styles from './WordMatchScreen.module.css';
import { useGame } from '../../store/useGame';
import { answerCorrect, answerWrong, navigateTo } from '../../store/actions';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { WORDS } from '../../data/words';
import { calculateXP } from '../../logic/xp';
import { LEVELS } from '../../data/levels';
import { shuffle, getDistractors } from '../../logic/flashcard';
import { RoundScorecardScreen } from '../RoundScorecardScreen/RoundScorecardScreen';

interface RoundResult {
  roundNumber: number;
  targetWord: string;
  targetMeaning: string;
  matchWord: string;
  matchMeaning: string;
  relationship: 'synonym' | 'antonym';
  distractors: { word: string; meaning: string }[];
  gotCorrect: boolean;
}
import { SummaryScreen } from '../SummaryScreen/SummaryScreen';

interface MatchCard {
  id: string;
  text: string;
  word: string; // full Word object reference by word string
  isTarget: boolean;
  isMatch: boolean;
}

type CardState = 'idle' | 'selected' | 'correct' | 'wrong';
type GameView = 'playing' | 'round-scorecard' | 'summary';

const TOTAL_ROUNDS = 10;

export function WordMatchScreen() {
  const { state, dispatch } = useGame();
  const { profile, selectedLevel } = state;

  const levelConfig = LEVELS.find(l => l.level === selectedLevel);

  // Pick TOTAL_ROUNDS unique words for this session
  const [sessionWords, setSessionWords] = useState<typeof WORDS>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [usedWordIds, setUsedWordIds] = useState<Set<string>>(new Set());

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [xpFloat, setXpFloat] = useState<string | null>(null);
  const [relationship, setRelationship] = useState<'synonym' | 'antonym'>('synonym');

  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [currentRoundResult, setCurrentRoundResult] = useState<RoundResult | null>(null);
  const [gameView, setGameView] = useState<GameView>('playing');

  // Store distractor Word objects for current round (for meanings)
  const [currentDistractorWords, setCurrentDistractorWords] = useState<typeof WORDS>([]);
  const [currentMatchMeaning, setCurrentMatchMeaning] = useState('');
  const [currentMatchWord, setCurrentMatchWord] = useState('');

  function pickSessionWords(excludeIds: Set<string> = new Set()) {
    const levelWords = WORDS.filter(w => w.level === selectedLevel && !excludeIds.has(w.id));
    const shuffled = shuffle(levelWords);
    return shuffled.slice(0, TOTAL_ROUNDS);
  }

  // Initialize first session
  useEffect(() => {
    const words = pickSessionWords();
    setSessionWords(words);
    setUsedWordIds(new Set(words.map(w => w.id)));
    setRoundIndex(0);
    setRoundResults([]);
  }, []);

  const currentWord = sessionWords[roundIndex];

  useEffect(() => {
    if (!currentWord) return;

    let matchText = '';
    let matchMeaning = '';
    let rel: 'synonym' | 'antonym' = 'synonym';

    if (currentWord.antonyms && currentWord.antonyms.length > 0) {
      matchText = currentWord.antonyms[Math.floor(Math.random() * currentWord.antonyms.length)];
      rel = 'antonym';
      // Try to find the meaning from WORDS
      const matchWordObj = WORDS.find(w => w.word.toLowerCase() === matchText.toLowerCase());
      matchMeaning = matchWordObj?.meaning ?? `Opposite of "${currentWord.word}"`;
    } else if (currentWord.synonyms.length > 0) {
      matchText = currentWord.synonyms[Math.floor(Math.random() * currentWord.synonyms.length)];
      rel = 'synonym';
      const matchWordObj = WORDS.find(w => w.word.toLowerCase() === matchText.toLowerCase());
      matchMeaning = matchWordObj?.meaning ?? `Similar in meaning to "${currentWord.word}"`;
    } else {
      matchText = currentWord.meaning.split(' ').slice(0, 2).join(' ');
      matchMeaning = currentWord.meaning;
    }

    setRelationship(rel);
    setCurrentMatchWord(matchText);
    setCurrentMatchMeaning(matchMeaning);

    const distractors = getDistractors(currentWord, WORDS, 4);
    setCurrentDistractorWords(distractors);

    const newCards: MatchCard[] = shuffle([
      { id: 'target', text: currentWord.word, word: currentWord.word, isTarget: true, isMatch: false },
      { id: 'match', text: matchText, word: matchText, isTarget: false, isMatch: true },
      ...distractors.map((w, i) => ({
        id: `dist-${i}`,
        text: w.word,
        word: w.word,
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
  }, [currentWord]);

  function finishRound(gotCorrect: boolean) {
    if (!currentWord) return;

    const result: RoundResult = {
      roundNumber: roundIndex + 1,
      targetWord: currentWord.word,
      targetMeaning: currentWord.meaning,
      matchWord: currentMatchWord,
      matchMeaning: currentMatchMeaning,
      relationship,
      distractors: currentDistractorWords.map(w => ({ word: w.word, meaning: w.meaning })),
      gotCorrect,
    };

    const newResults = [...roundResults, result];
    setRoundResults(newResults);
    setCurrentRoundResult(result);
    setGameView('round-scorecard');
  }

  function handleNextFromScorecard() {
    const isLastRound = roundIndex + 1 >= TOTAL_ROUNDS;
    if (isLastRound) {
      setGameView('summary');
    } else {
      setRoundIndex(prev => prev + 1);
      setGameView('playing');
    }
  }

  function handlePlayAgain() {
    // Pick new words, excluding all previously used words
    const newUsed = new Set([...usedWordIds]);
    const newWords = pickSessionWords(newUsed);

    // If not enough words left, reset used pool
    const finalWords = newWords.length >= TOTAL_ROUNDS
      ? newWords
      : pickSessionWords();

    const finalUsed = new Set([...newUsed, ...finalWords.map(w => w.id)]);

    setUsedWordIds(finalUsed);
    setSessionWords(finalWords);
    setRoundIndex(0);
    setRoundResults([]);
    setCurrentRoundResult(null);
    setGameView('playing');
  }

  function handleCardTap(cardId: string) {
    if (!currentWord || locked || cardStates[cardId] === 'correct') return;

    if (selectedIds.includes(cardId)) {
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
          finishRound(true);
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
            finishRound(false);
          } else {
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

  // Render based on game view
  if (gameView === 'round-scorecard' && currentRoundResult) {
    return (
      <RoundScorecardScreen
        result={currentRoundResult}
        totalRounds={TOTAL_ROUNDS}
        onNext={handleNextFromScorecard}
      />
    );
  }

  if (gameView === 'summary') {
    return (
      <SummaryScreen
        results={roundResults}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentWord) {
    return (
      <div className={styles.empty}>
        <p>No words available for this level.</p>
        <button onClick={() => dispatch(navigateTo('LEVEL_MAP'))}>Back</button>
      </div>
    );
  }

  const hint = relationship === 'antonym' ? 'Find the antonym pair' : 'Find the synonym pair';

  return (
    <div className={`screen ${styles.wordMatch}`}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch(navigateTo('MODE_SELECT'))}>←</button>
        <span className={styles.progress}>{roundIndex + 1} / {TOTAL_ROUNDS}</span>
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
