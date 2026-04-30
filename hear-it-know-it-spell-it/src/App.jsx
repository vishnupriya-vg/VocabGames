import { useState, useMemo, useRef } from 'react';
import { WORDS } from './data/wordlist.js';
import HomeScreen      from './components/HomeScreen.jsx';
import HowToPlay       from './components/HowToPlay.jsx';
import MCQStage        from './components/MCQStage.jsx';
import SpellingStage   from './components/SpellingStage.jsx';
import WordResultCard  from './components/WordResultCard.jsx';
import RoundComplete   from './components/RoundComplete.jsx';
import SessionSummary  from './components/SessionSummary.jsx';
import SessionProgress from './components/SessionProgress.jsx';
import ConfettiBlast   from './components/ConfettiBlast.jsx';
import './App.css';

// Screens: 'home' | 'how-to-play' | 'mcq' | 'spelling' | 'word-result' | 'round-complete' | 'summary'

export default function App() {
  const [screen, setScreen]               = useState('home');
  const [grade, setGrade]                 = useState(null);
  const [mode, setMode]                   = useState(null);   // 'quick' | 'full'
  const [wordIdx, setWordIdx]             = useState(0);
  const [results, setResults]             = useState([]);
  const [showConfetti, setShowConfetti]   = useState(false);
  const [currentMcqOutcome, setCurrentMcqOutcome] = useState(null);

  const confettiTimerRef = useRef(null);

  // ── Derived word list ─────────────────────────────────────

  const gradeWords = useMemo(() => {
    if (!grade) return [];
    const gw = WORDS.filter(w => w.grade === grade);
    return mode === 'quick' ? gw.filter(w => w.round <= 2) : gw;
  }, [grade, mode]);

  const totalRounds  = mode === 'quick' ? 2 : 5;
  const currentWord  = gradeWords[wordIdx];
  const round        = Math.floor(wordIdx / 5) + 1;
  const wordInRound  = (wordIdx % 5) + 1;
  const isLastWord   = wordIdx === gradeWords.length - 1;
  const isLastWordOfRound = wordInRound === 5 && !isLastWord;
  const isLastRound       = round === totalRounds;

  // ── Confetti ──────────────────────────────────────────────

  function triggerConfetti() {
    clearTimeout(confettiTimerRef.current);
    setShowConfetti(true);
    confettiTimerRef.current = setTimeout(() => setShowConfetti(false), 3000);
  }

  // ── Navigation helpers ────────────────────────────────────

  function resetWordTrack() {
    setCurrentMcqOutcome(null);
  }

  // ── Screen transitions ────────────────────────────────────

  function handleGradeSelect(g, m) {
    setGrade(g);
    setMode(m);
    setWordIdx(0);
    setResults([]);
    setShowConfetti(false);
    resetWordTrack();
    setScreen('how-to-play');
  }

  function handleHowToPlayStart() {
    setScreen('mcq');
  }

  function handleMCQComplete(mcqResult) {
    setResults(prev => {
      const next = [...prev];
      next[wordIdx] = { word: currentWord, mcq: mcqResult, spelling: null };
      return next;
    });
    setCurrentMcqOutcome(mcqResult.correct ? 'correct' : 'wrong');
    setScreen('spelling');
  }

  function handleSpellingComplete(spellingResult) {
    const mcqResult = results[wordIdx]?.mcq;
    const isPerfect =
      mcqResult?.correct    === true && (mcqResult?.hintsUsed    ?? 1) === 0 &&
      spellingResult.correct === true && (spellingResult.attempts ?? 1) === 0 &&
                                         (spellingResult.hintsUsed ?? 1) === 0;

    if (isPerfect) triggerConfetti();

    setResults(prev => {
      const next = [...prev];
      next[wordIdx] = { ...next[wordIdx], spelling: spellingResult };
      return next;
    });

    setScreen('word-result');
  }

  function handleWordResultNext() {
    if (isLastWord) {
      setScreen('summary');
    } else if (isLastWordOfRound) {
      setScreen('round-complete');
    } else {
      setWordIdx(i => i + 1);
      resetWordTrack();
      setScreen('mcq');
    }
  }

  function handleRoundCompleteNext() {
    setWordIdx(i => i + 1);
    resetWordTrack();
    setScreen('mcq');
  }

  function handlePlayAgain() {
    setWordIdx(0);
    setResults([]);
    setShowConfetti(false);
    resetWordTrack();
    setScreen('mcq');
  }

  function handleChooseGrade() {
    setGrade(null);
    setMode(null);
    setWordIdx(0);
    setResults([]);
    setShowConfetti(false);
    resetWordTrack();
    setScreen('home');
  }

  // ── Round results for RoundComplete ──────────────────────

  const roundResults = results.slice((round - 1) * 5, round * 5);

  // ── Word result data ──────────────────────────────────────

  const mcqResult   = results[wordIdx]?.mcq;
  const spellResult = results[wordIdx]?.spelling;

  // ── Game screens (show SessionProgress header) ────────────

  const isGameScreen = ['mcq', 'spelling', 'word-result', 'round-complete'].includes(screen);

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="app">

      {isGameScreen && (
        <SessionProgress
          round={round}
          wordInRound={wordInRound}
          totalRounds={totalRounds}
          onHome={handleChooseGrade}
        />
      )}

      {screen === 'home' && (
        <HomeScreen onGradeSelect={handleGradeSelect} />
      )}

      {screen === 'how-to-play' && (
        <HowToPlay
          grade={grade}
          mode={mode}
          onStart={handleHowToPlayStart}
          onHome={handleChooseGrade}
        />
      )}

      {screen === 'mcq' && currentWord && (
        <MCQStage
          key={`mcq-${grade}-${wordIdx}`}
          wordData={currentWord}
          onComplete={handleMCQComplete}
        />
      )}

      {screen === 'spelling' && currentWord && (
        <SpellingStage
          key={`spelling-${grade}-${wordIdx}`}
          wordData={currentWord}
          mcqOutcome={currentMcqOutcome}
          onComplete={handleSpellingComplete}
        />
      )}

      {screen === 'word-result' && currentWord && mcqResult && spellResult && (
        <WordResultCard
          key={`wrc-${grade}-${wordIdx}`}
          wordData={currentWord}
          mcqResult={mcqResult}
          spellResult={spellResult}
          isLastWord={isLastWord}
          isLastWordOfRound={isLastWordOfRound}
          onNext={handleWordResultNext}
        />
      )}

      {screen === 'round-complete' && (
        <RoundComplete
          key={`rc-${grade}-${round}`}
          round={round}
          roundResults={roundResults}
          isLastRound={isLastRound}
          onNext={handleRoundCompleteNext}
          onFinish={() => setScreen('summary')}
        />
      )}

      {screen === 'summary' && (
        <SessionSummary
          results={results}
          grade={grade}
          onPlayAgain={handlePlayAgain}
          onChooseGrade={handleChooseGrade}
        />
      )}

      <ConfettiBlast active={showConfetti} />
    </div>
  );
}
