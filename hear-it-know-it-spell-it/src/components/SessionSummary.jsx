import { useState, useEffect } from 'react';
import { useScore } from '../hooks/useScore.js';
import './SessionSummary.css';

export default function SessionSummary({ results, grade, onPlayAgain, onChooseGrade }) {
  const { wordRows, rawTotal, multiplier, finalScore, bestStreak, stars } = useScore(results);
  const [displayed, setDisplayed] = useState(0);

  // Smooth animated count-up (cubic ease-out, ~1.8 s)
  useEffect(() => {
    if (finalScore === 0) { setDisplayed(0); return; }
    let frame;
    const t0  = performance.now();
    const dur = 1800;

    function tick(now) {
      const t      = Math.min((now - t0) / dur, 1);
      const eased  = 1 - (1 - t) ** 3;
      setDisplayed(Math.round(eased * finalScore));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finalScore]);

  const ActionRow = () => (
    <div className="sum-actions">
      <button className="sum-btn-primary"   onClick={onPlayAgain}>Play Again</button>
      <button className="sum-btn-secondary" onClick={onChooseGrade}>Choose Grade</button>
    </div>
  );

  return (
    <div className="summary">

      {/* ── Score / Stars ─────────────────────────────────────── */}
      <div className="sum-hero">
        <p className="sum-grade-label">Grade {grade} · Complete</p>

        <div className="sum-score">{displayed.toLocaleString()}</div>

        <div className="sum-stars">
          {[1, 2, 3].map(n => <StarSVG key={n} filled={n <= stars} delay={(n - 1) * 0.18} />)}
        </div>

        {multiplier > 1 && (
          <div className="sum-streak-badge">
            {multiplier}× streak bonus — {bestStreak} perfect words in a row!
          </div>
        )}

        {multiplier > 1 && (
          <p className="sum-calc">
            {rawTotal.toLocaleString()} × {multiplier} = {finalScore.toLocaleString()} pts
          </p>
        )}
      </div>

      <ActionRow />

      {/* ── Word table ────────────────────────────────────────── */}
      <div className="sum-table-wrap">
        <table className="sum-table">
          <thead>
            <tr>
              <th className="col-word">Word</th>
              <th className="col-def">Definition</th>
              <th className="col-ex">Example Sentence</th>
              <th className="col-mcq">MCQ</th>
              <th className="col-spell">Spelling</th>
              <th className="col-out">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {wordRows.map((row, i) => {
              if (!row) return null;
              const { wordObj, mcq, spell, outcome } = row;
              return (
                <tr key={i} className={`sum-row sum-row-${outcome.toLowerCase()}`}>
                  <td className="col-word td-word">{wordObj.word}</td>
                  <td className="col-def">{wordObj.definition}</td>
                  <td className="col-ex td-example">
                    <em>{wordObj.exampleSentence}</em>
                  </td>
                  <td className="col-mcq"><MCQCell mcq={mcq} /></td>
                  <td className="col-spell"><SpellCell spell={spell} /></td>
                  <td className="col-out">
                    <OutcomeBadge outcome={outcome} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ActionRow />
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function MCQCell({ mcq }) {
  if (!mcq) return <span className="na">—</span>;

  const revealed = (mcq.hintsUsed ?? 0) >= 3;
  const ok       = mcq.correct && !revealed;
  const label    = ok ? 'Correct' : revealed ? 'Revealed' : 'Wrong';

  return (
    <div className={`result-pill ${ok ? 'pill-ok' : 'pill-fail'}`}>
      <span>{label}</span>
      {(mcq.hintsUsed ?? 0) > 0 && (
        <span className="pill-sub">{mcq.hintsUsed} hint{mcq.hintsUsed !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}

function SpellCell({ spell }) {
  if (!spell) return <span className="na">—</span>;

  const ok = spell.correct;
  const ordinals = ['1st', '2nd', '3rd'];
  const attemptLabel = ok
    ? (ordinals[spell.attempts] ?? `${spell.attempts + 1}th`) + ' try'
    : 'Failed';

  return (
    <div className={`result-pill ${ok ? 'pill-ok' : 'pill-fail'}`}>
      <span>{attemptLabel}</span>
      {(spell.hintsUsed ?? 0) > 0 && (
        <span className="pill-sub">{spell.hintsUsed} hint{spell.hintsUsed !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}

function OutcomeBadge({ outcome }) {
  return (
    <span className={`outcome-badge badge-${outcome.toLowerCase()}`}>
      {outcome}
    </span>
  );
}

function StarSVG({ filled, delay }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`star-svg ${filled ? 'star-on' : 'star-off'}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
