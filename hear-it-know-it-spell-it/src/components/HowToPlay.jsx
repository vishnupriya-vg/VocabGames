import './HowToPlay.css';

const STEPS = [
  {
    icon: '🎧',
    heading: 'Hear It',
    body: 'Listen to the vocabulary word spoken aloud. Replay as many times as you like!',
  },
  {
    icon: '🧠',
    heading: 'Know It',
    body: 'Choose the correct definition from 4 options. Use hints if you need them — but they cost points!',
  },
  {
    icon: '✏️',
    heading: 'Spell It',
    body: 'Type the word using the on-screen keyboard. You get 3 tries; hints reveal locked letters.',
  },
];

export default function HowToPlay({ grade, mode, onStart, onHome }) {
  const rounds = mode === 'quick' ? 2 : 5;
  const words  = mode === 'quick' ? 10 : 25;
  const modeLabel = mode === 'quick' ? 'Quick Play' : 'Full Session';

  return (
    <div className="htp">
      <div className="page-top-bar">
        <button className="page-home-btn" onClick={onHome}>⌂ Home</button>
      </div>

      <div className="htp-hero">
        <h1 className="htp-title">How to Play</h1>
        <p className="htp-meta">Grade {grade} · {modeLabel} · {rounds} rounds · {words} words</p>
      </div>

      <div className="htp-steps">
        {STEPS.map(({ icon, heading, body }) => (
          <div key={heading} className="htp-step">
            <div className="htp-step-icon">{icon}</div>
            <div className="htp-step-body">
              <h2 className="htp-step-heading">{heading}</h2>
              <p className="htp-step-text">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="htp-tip">
        💡 Spell every word perfectly on the first try with no hints for a streak bonus!
      </div>

      <button className="htp-start-btn" onClick={onStart}>
        Let's Go! →
      </button>
    </div>
  );
}
