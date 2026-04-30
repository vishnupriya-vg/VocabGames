import { highlightWord } from '../utils.jsx';

export default function WordResultCard({ result, wordIndex, total, onNext, onHome }) {
  const isLast = wordIndex + 1 >= total;

  return (
    <div className="result-card-screen">
      <header className="game-header">
        <button className="home-btn" onClick={onHome}>⌂ Home</button>
        <span className="progress-label-sm">Word {wordIndex + 1} of {total}</span>
      </header>

      <div className="result-card">
        <div className={`result-badge ${result.correct ? 'badge-correct' : 'badge-incorrect'}`}>
          {result.correct ? '✓ Correct' : '✗ Incorrect'}
        </div>

        <h2 className="result-word">{result.word}</h2>

        <div className="result-points">
          {result.points > 0 ? `+${result.points} pts` : '0 pts'}
          {result.hintsUsed > 0 && (
            <span className="hints-note">
              {' '}· {result.hintsUsed} hint{result.hintsUsed > 1 ? 's' : ''} used
            </span>
          )}
        </div>

        <div className="result-sentence-box">
          <div className="result-sentence-label">Correct sentence</div>
          <p className="result-sentence">
            {highlightWord(result.correctSentence, result.word, 'word-highlight-correct')}
          </p>
        </div>

        <p className="result-explanation">{result.explanation}</p>

        <button className="btn-primary" onClick={onNext}>
          {isLast ? 'See Final Results →' : 'Next Word →'}
        </button>
      </div>
    </div>
  );
}
