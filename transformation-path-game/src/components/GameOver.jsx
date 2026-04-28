export default function GameOver({ score, chain, mode, onPlayAgain, onMenu }) {
  const isTimedOut = mode === 'timed';

  return (
    <div className="win-overlay">
      <div className="win-card gameover-card">
        <div className="win-emoji">{score >= 10 ? '🔥' : score >= 5 ? '⭐' : '👍'}</div>
        <h2 className="win-title">{isTimedOut ? "Time's Up!" : 'Game Over'}</h2>

        <div className="gameover-score">
          <span className="gameover-score__num">{score}</span>
          <span className="gameover-score__label">word{score !== 1 ? 's' : ''} built</span>
        </div>

        <div className="gameover-chain-wrap">
          <p className="gameover-chain-label">Your chain</p>
          <div className="gameover-chain">
            {chain.map((word, i) => (
              <span key={i} className="gc-step">
                <span className={`gc-word ${i === 0 ? 'gc-word--start' : ''}`}>{word}</span>
                {i < chain.length - 1 && <span className="chain-arrow">→</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="win-actions">
          <button className="btn btn--secondary" onClick={onMenu}>Menu</button>
          <button className="btn btn--primary" onClick={onPlayAgain}>Play Again</button>
        </div>
      </div>
    </div>
  );
}
