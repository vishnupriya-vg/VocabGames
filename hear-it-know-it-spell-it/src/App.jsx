import { useState, useMemo } from 'react';
import { WORDS } from './data/wordlist.js';
import HomeScreen from './components/HomeScreen.jsx';
import MCQStage from './components/MCQStage.jsx';
import SpellingStage from './components/SpellingStage.jsx';
import './App.css';

export default function App() {
  const [screen, setScreen]   = useState('home');   // 'home' | 'mcq' | 'spelling' | 'summary'
  const [grade, setGrade]     = useState(null);
  const [wordIdx, setWordIdx] = useState(0);         // 0–24
  const [results, setResults] = useState([]);        // per-word results for SessionSummary

  const gradeWords = useMemo(
    () => (grade ? WORDS.filter(w => w.grade === grade) : []),
    [grade]
  );

  const currentWord  = gradeWords[wordIdx];
  const round        = Math.floor(wordIdx / 5) + 1;
  const wordInRound  = (wordIdx % 5) + 1;

  function handleGradeSelect(g) {
    setGrade(g);
    setWordIdx(0);
    setResults([]);
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

  // Called by SpellingStage once it's built
  function handleSpellingComplete(spellingResult) {
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
    setScreen('mcq');
  }

  function handleChooseGrade() {
    setGrade(null);
    setWordIdx(0);
    setResults([]);
    setScreen('home');
  }

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

      {/* SessionSummary placeholder — replaced when SessionSummary is built */}
      {screen === 'summary' && (
        <div className="stage-placeholder">
          <p className="placeholder-label">Session Complete!</p>
          <p className="placeholder-note">{gradeWords.length} words done · Summary coming soon.</p>
          <div className="placeholder-actions">
            <button className="placeholder-btn" onClick={handlePlayAgain}>Play Again</button>
            <button className="placeholder-btn secondary" onClick={handleChooseGrade}>Choose Grade</button>
          </div>
        </div>
      )}
    </div>
  );
}
