import { useState, useEffect } from 'react';
import ConfettiBlast from './ConfettiBlast.jsx';
import { highlightWord } from '../utils.jsx';

export default function SessionSummary({
  results,
  score,
  grade,
  onPlayAgain,
  onChooseGrade,
  onHome,
}) {
  const maxPossible = results.length * 100;
  const pct = maxPossible > 0 ? score / maxPossible : 0;
  const stars = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : 1;

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (score === 0) {
      setDisplayScore(0);
      return;
    }
    const steps = 40;
    const inc = score / steps;
    let current = 0;
    const id = setInterval(() => {
      current += inc;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(id);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, 30);
    return () => clearInterval(id);
  }, [score]);

  return (
    <div className="summary-screen">
      {stars === 3 && <ConfettiBlast />}

      <header className="game-header">
        <button className="home-btn" onClick={onHome}>⌂ Home</button>
        <span className="summary-header-title">Grade {grade} Complete!</span>
        <div className="header-spacer" />
      </header>

      <div className="summary-score-section">
        <div className="star-row">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`star ${n <= stars ? 'star-filled' : 'star-empty'}`}>
              ★
            </span>
          ))}
        </div>
        <div className="summary-score">{displayScore}</div>
        <div className="summary-score-label">points</div>
      </div>

      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>Word</th>
              <th>Correct sentence</th>
              <th>Result</th>
              <th>Hints</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.wordId} className={r.correct ? 'row-correct' : 'row-incorrect'}>
                <td className="td-word">{r.word}</td>
                <td className="td-sentence">
                  {highlightWord(r.correctSentence, r.word, 'word-highlight-correct')}
                </td>
                <td className="td-result">{r.correct ? '✓' : '✗'}</td>
                <td className="td-hints">{r.hintsUsed}</td>
                <td className="td-points">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-actions">
        <button className="btn-primary" onClick={onPlayAgain}>Play Again</button>
        <button className="btn-secondary" onClick={onChooseGrade}>Choose Grade</button>
      </div>
    </div>
  );
}
