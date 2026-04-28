export default function HintModal({ hint, onClose }) {
  return (
    <div className="win-overlay" onClick={onClose}>
      <div className="win-card hint-card" onClick={e => e.stopPropagation()}>
        <h2 className="win-title">One Solution</h2>
        <div className="win-path">
          {hint.map((word, i) => (
            <span key={i} className="win-path-step">
              <span className="win-path-word">{word}</span>
              {i < hint.length - 1 && <span className="win-path-arrow">→</span>}
            </span>
          ))}
        </div>
        <p className="hint-note">There may be other valid paths too!</p>
        <button className="btn btn--primary" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
