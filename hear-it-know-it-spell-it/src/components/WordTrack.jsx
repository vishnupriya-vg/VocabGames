import './WordTrack.css';

export default function WordTrack({ heard, mcqOutcome, spellOutcome }) {
  const allPerfect = heard && mcqOutcome === 'correct' && spellOutcome === 'correct';

  return (
    <div className={`word-track${allPerfect ? ' track-perfect' : ''}`}>
      {allPerfect && <div className="track-badge">Perfect Word! ⭐</div>}
      <div className="track-nodes">
        <TrackNode icon="🎧" label="Hear" state={heard ? 'done' : 'idle'} />
        <div className={`track-line${heard && mcqOutcome ? ' line-active' : ''}`} />
        <TrackNode icon="🧠" label="Know" state={mcqOutcome ?? 'idle'} />
        <div className={`track-line${mcqOutcome && spellOutcome ? ' line-active' : ''}`} />
        <TrackNode icon="✏️" label="Spell" state={spellOutcome ?? 'idle'} />
      </div>
    </div>
  );
}

function TrackNode({ icon, label, state }) {
  const cls =
    state === 'done' || state === 'correct' ? 'node-correct'
    : state === 'wrong' ? 'node-wrong'
    : 'node-idle';

  return (
    <div className="track-node-wrap">
      <div className={`track-node ${cls}`}>
        <span className="node-icon">{icon}</span>
      </div>
      <span className="node-label">{label}</span>
    </div>
  );
}
