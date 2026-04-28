export default function WinScreen({ path, moves, puzzle, onNext, onRetry, hasNext }) {
  return (
    <div className="win-overlay">
      <div className="win-card">
        <div className="win-emoji">🎉</div>
        <h2 className="win-title">Solved!</h2>
        <p className="win-moves">{moves} move{moves !== 1 ? 's' : ''}</p>

        <div className="win-path">
          {path.map((word, i) => (
            <span key={i} className="win-path-step">
              <span className="win-path-word">{word}</span>
              {i < path.length - 1 && <span className="win-path-arrow">→</span>}
            </span>
          ))}
        </div>

        <div className="win-actions">
          <button className="btn btn--secondary" onClick={onRetry}>
            Retry
          </button>
          {hasNext && (
            <button className="btn btn--primary" onClick={onNext}>
              Next Level →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
