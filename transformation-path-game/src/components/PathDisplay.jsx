export default function PathDisplay({ path, targetWord }) {
  return (
    <div className="path-display">
      <div className="path-chain">
        {path.map((word, i) => (
          <span key={i} className="path-step">
            <span className={`path-word ${word === targetWord ? 'path-word--target' : ''}`}>
              {word}
            </span>
            {i < path.length - 1 && <span className="path-arrow">→</span>}
          </span>
        ))}
        {path[path.length - 1] !== targetWord && (
          <span className="path-step">
            <span className="path-arrow">→</span>
            <span className="path-word path-word--goal">?</span>
          </span>
        )}
      </div>
    </div>
  );
}
