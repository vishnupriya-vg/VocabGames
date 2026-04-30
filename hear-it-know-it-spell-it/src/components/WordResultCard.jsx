import WordTrack from './WordTrack.jsx';
import './WordResultCard.css';

export default function WordResultCard({
  wordData,
  mcqResult,
  spellResult,
  isLastWord,
  isLastWordOfRound,
  onNext,
}) {
  const mcqPts   = mcqResult?.points ?? 0;
  const spellPts = spellResult?.points ?? 0;
  const totalPts = mcqPts + spellPts;

  const mcqOutcome   = mcqResult?.correct   ? 'correct' : mcqResult   ? 'wrong' : null;
  const spellOutcome = spellResult?.correct  ? 'correct' : spellResult ? 'wrong' : null;
  const wordTrack    = { heard: true, mcqOutcome, spellOutcome };
  const isPerfect    = mcqOutcome === 'correct' && spellOutcome === 'correct';

  const btnLabel = isLastWord       ? 'See Final Results →'
    : isLastWordOfRound              ? 'See Round Results →'
    : 'Next Word →';

  return (
    <div className="wrc-screen">
      <div className={`wrc-card${isPerfect ? ' wrc-card-perfect' : ''}`}>
        {isPerfect && (
          <div className="wrc-perfect-banner">⭐ Perfect Word!</div>
        )}

        <div className="wrc-word">{wordData.word}</div>

        <WordTrack {...wordTrack} />

        <div className="wrc-results">
          <WrcRow
            icon="🧠"
            label="MCQ"
            ok={mcqResult?.correct}
            detail={mcqResult?.hintsUsed > 0 ? `${mcqResult.hintsUsed} hint${mcqResult.hintsUsed !== 1 ? 's' : ''}` : null}
            pts={mcqPts}
          />
          <WrcRow
            icon="✏️"
            label="Spelling"
            ok={spellResult?.correct}
            detail={
              spellResult?.correct
                ? (spellResult.attempts === 0 ? '1st try' : spellResult.attempts === 1 ? '2nd try' : '3rd try')
                : spellResult ? 'Failed' : null
            }
            pts={spellPts}
          />
        </div>

        <div className="wrc-total">
          <span className="wrc-total-label">Word total</span>
          <span className="wrc-total-pts">+{totalPts} pts</span>
        </div>

        <button className="wrc-next-btn" onClick={onNext}>
          {btnLabel}
        </button>
      </div>
    </div>
  );
}

function WrcRow({ icon, label, ok, detail, pts }) {
  return (
    <div className={`wrc-row ${ok ? 'row-ok' : 'row-fail'}`}>
      <span className="wrc-row-icon">{icon}</span>
      <span className="wrc-row-label">{label}</span>
      {detail && <span className="wrc-row-detail">{detail}</span>}
      <span className="wrc-row-status">{ok ? '✓' : '✗'}</span>
      <span className="wrc-row-pts">+{pts}</span>
    </div>
  );
}
