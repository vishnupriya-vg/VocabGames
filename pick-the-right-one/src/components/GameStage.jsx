import { useState } from 'react';
import { highlightWord } from '../utils.jsx';

export default function GameStage({
  word,
  wordIndex,
  total,
  hints,
  score,
  onUseHint,
  onSubmit,
  onHome,
}) {
  const [selected, setSelected] = useState(null);

  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === word.correct;
  const incorrectSide = word.correct === 'A' ? 'B' : 'A';

  function cardClass(side) {
    if (!isAnswered) return 'sentence-card';
    return side === word.correct
      ? 'sentence-card card-correct'
      : 'sentence-card card-incorrect';
  }

  return (
    <div className="game-stage">
      <header className="game-header">
        <button className="home-btn" onClick={onHome}>⌂ Home</button>
        <span className="score-display">{score} pts</span>
      </header>

      <div className="word-header">
        <div className="progress-label">Word {wordIndex + 1} of {total}</div>
        <h2 className="word-title">{word.word}</h2>
        <div className="word-pos">{word.partOfSpeech}</div>
        <p className="instruction">
          Choose the sentence that uses the highlighted word correctly
        </p>
      </div>

      {hints >= 1 && (
        <div className="definition-box">
          <span className="def-label">Definition: </span>
          {word.definition}
        </div>
      )}

      <div className="sentence-grid">
        {['A', 'B'].map((side) => {
          const text = side === 'A' ? word.sentenceA : word.sentenceB;
          const eliminated = hints >= 2 && !isAnswered && side === incorrectSide;
          return (
            <button
              key={side}
              className={`${cardClass(side)}${eliminated ? ' card-eliminated' : ''}`}
              onClick={() => { if (!isAnswered) setSelected(side); }}
              disabled={isAnswered}
              aria-label={`Sentence ${side}`}
            >
              <div className="sentence-label">Sentence {side}</div>
              <div className="sentence-text">
                {highlightWord(text, word.word)}
              </div>
            </button>
          );
        })}
      </div>

      {!isAnswered && (
        <div className="hint-row">
          <button
            className="hint-btn"
            onClick={onUseHint}
            disabled={hints >= 1}
          >
            {hints >= 1
              ? '✓ Definition shown'
              : 'Hint 1: Show Definition (−50 pts)'}
          </button>
          <button
            className="hint-btn"
            onClick={onUseHint}
            disabled={hints < 1 || hints >= 2}
          >
            {hints >= 2
              ? '✓ Eliminate used'
              : 'Hint 2: Eliminate (−25 pts)'}
          </button>
        </div>
      )}

      {isAnswered && (
        <div className="feedback-section">
          <p className={`feedback-text ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
            {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
            {word.explanation}
          </p>
          <button className="btn-primary" onClick={() => onSubmit(selected)}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
