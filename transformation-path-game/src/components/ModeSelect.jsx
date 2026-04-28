export default function ModeSelect({ onSelect, onBack }) {
  return (
    <div className="mode-select">
      <button className="btn-back" onClick={onBack}>← Back</button>
      <h2 className="mode-select__title">Choose Mode</h2>

      <button className="mode-card" onClick={() => onSelect('timed')}>
        <span className="mode-card__icon">⏱</span>
        <span className="mode-card__name">Timed</span>
        <span className="mode-card__desc">60 seconds to build as many words as you can</span>
      </button>

      <button className="mode-card" onClick={() => onSelect('endless')}>
        <span className="mode-card__icon">∞</span>
        <span className="mode-card__name">Endless</span>
        <span className="mode-card__desc">No time limit — keep going until you're stuck</span>
      </button>
    </div>
  );
}
