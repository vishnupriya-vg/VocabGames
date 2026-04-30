import './SessionProgress.css';

export default function SessionProgress({ round, wordInRound, totalRounds, onHome }) {
  return (
    <div className="sp-bar">
      <button className="sp-home-btn" onClick={onHome} aria-label="Go home">
        ⌂ Home
      </button>

      <div className="sp-rounds">
        {Array.from({ length: totalRounds }, (_, i) => {
          const r = i + 1;
          const done    = r < round;
          const current = r === round;
          const pct     = done ? 100 : current ? Math.round((wordInRound / 5) * 100) : 0;
          const complete = done || (current && wordInRound >= 5);
          return (
            <div
              key={i}
              className={`sp-round-icon ${complete ? 'sp-icon-done' : current ? 'sp-icon-current' : 'sp-icon-pending'}`}
            >
              <div className="sp-fill" style={{ width: `${pct}%` }} />
              <span className="sp-rnum">{r}</span>
            </div>
          );
        })}
      </div>

      <span className="sp-label">Round {round} · {wordInRound}/5</span>
    </div>
  );
}
