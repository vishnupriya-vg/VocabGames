import { ALPHABET } from '../utils/wordUtils';

export default function LetterPicker({ onPick, disabledLetter }) {
  return (
    <div className="letter-picker">
      <p className="letter-picker__label">Pick a letter:</p>
      <div className="letter-grid">
        {ALPHABET.map(ch => (
          <button
            key={ch}
            className={`letter-btn ${ch === disabledLetter ? 'letter-btn--disabled' : ''}`}
            onClick={() => ch !== disabledLetter && onPick(ch)}
            disabled={ch === disabledLetter}
          >
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
}
