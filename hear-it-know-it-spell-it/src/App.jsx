import { useState, useMemo, useRef } from 'react';
import { WORDS } from './data/wordlist.js';
import HomeScreen     from './components/HomeScreen.jsx';
import MCQStage       from './components/MCQStage.jsx';
import SpellingStage  from './components/SpellingStage.jsx';
import SessionSummary from './components/SessionSummary.jsx';
import ConfettiBlast  from './components/ConfettiBlast.jsx';
import './App.css';

export default function App() {
  const [screen, setScreen]       = useState('home');
  const [grade, setGrade]         = useState(null);
  const [wordIdx, setWordIdx]     = useState(0);
  const [results, setResults]     = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiTimerRef = useRef(null);

  const gradeWords = useMemo(
    () => (grade ? WORDS.filter(w => w.grade === grade) : []),
    [grade]
  );

  const currentWord = gradeWords[wordIdx];
  const round       = Math.floor(wordIdx / 5) + 1;
  const wordInRound = (wordIdx % 5) + 1;

  function triggerConfetti() {
    clearTimeout(confettiTimerRef.current);
    setShowConfetti(true);
    confettiTimerRef.current = setTimeout(() => setShowConfetti(false), 3000);
  }

  // ── Screen transitions ────────────────────────────────────

  function handleGradeSelect(g) {
    setGrade(g);
    setWordIdx(0);
    setResults([]);
    setShowConfetti(false);
    setScreen('mcq');
  }

  function handleMCQComplete(mcqResult) {
    setResults(prev => {
      const next = [...prev];
      next[wordIdx] = { word: currentWord, mcq: mcqResult, spelling: null };
      return next;
    });
    setScreen('spelling');
  }

  function handleSpellingComplete(spellingResult) {
    // Check perfect word before updating results state
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

    advanceToNextWord();
  }

  function advanceToNextWord() {
    if (wordIdx < gradeWords.length - 1) {
      setWordIdx(i => i + 1);
      setScreen('mcq');
    } else {
      setScreen('summary');
    }
  }

  function handlePlayAgain() {
    setWordIdx(0);
    setResults([]);
    setShowConfetti(false);
    setScreen('mcq');
  }

  function handleChooseGrade() {
    setGrade(null);
    setWordIdx(0);
    setResults([]);
    setShowConfetti(false);
    setScreen('home');
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen onGradeSelect={handleGradeSelect} />
      )}

      {screen === 'mcq' && currentWord && (
        <MCQStage
          key={`mcq-${grade}-${wordIdx}`}
          wordData={currentWord}
          round={round}
          wordInRound={wordInRound}
          onComplete={handleMCQComplete}
        />
      )}

      {screen === 'spelling' && currentWord && (
        <SpellingStage
          key={`spelling-${grade}-${wordIdx}`}
          wordData={currentWord}
          round={round}
          wordInRound={wordInRound}
          isLastWord={wordIdx === gradeWords.length - 1}
          onComplete={handleSpellingComplete}
          onHome={handleChooseGrade}
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
