import './RoundComplete.css';

export default function RoundComplete({ round, roundResults, isLastRound, onNext, onFinish }) {
  const roundScore = roundResults.reduce((sum, r) => {
    if (!r) return sum;
    return sum + (r.mcq?.points ?? 0) + (r.spelling?.points ?? 0);
  }, 0);

  const allPerfect = roundResults.length === 5 && roundResults.every(r => {
    if (!r) return false;
    const mcqOk   = r.mcq?.correct === true && (r.mcq?.hintsUsed   ?? 1) === 0;
    const spellOk = r.spelling?.correct === true
      && (r.spelling?.attempts ?? 1) === 0
      && (r.spelling?.hintsUsed ?? 1) === 0;
    return mcqOk && spellOk;
  });

  return (
    <div className="rc-screen">
      <div className="rc-hero">
        <p className="rc-label">Round {round} Complete!</p>
        <p className="rc-emoji">{allPerfect ? '🏆' : '🎉'}</p>
        {allPerfect && <p className="rc-perfect-msg">All 5 words — perfect!</p>}
      </div>

      <div className="rc-score-box">
        <span className="rc-score-label">Round Score</span>
        <span className="rc-score-value">+{roundScore.toLocaleString()}</span>
      </div>

      <div className="rc-word-list">
        {roundResults.map((r, i) => {
          if (!r) return null;
          const mcqOk   = r.mcq?.correct === true;
          const spellOk = r.spelling?.correct === true;
          const wordPts = (r.mcq?.points ?? 0) + (r.spelling?.points ?? 0);
          return (
            <div key={i} className="rc-word-row">
              <span className="rc-word-name">{r.word?.word ?? '—'}</span>
              <div className="rc-mini-track">
                <MiniNode color="green" />
                <MiniNode color={mcqOk   ? 'green' : 'red'} />
                <MiniNode color={spellOk ? 'green' : 'red'} />
              </div>
              <span className="rc-word-pts">+{wordPts}</span>
            </div>
          );
        })}
      </div>

      <button className="rc-btn" onClick={isLastRound ? onFinish : onNext}>
        {isLastRound ? 'See Final Results →' : `Start Round ${round + 1} →`}
      </button>
    </div>
  );
}

function MiniNode({ color }) {
  return (
    <span className={`mini-node mini-${color}`} />
  );
}
