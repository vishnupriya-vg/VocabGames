import './Keyboard.css';

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

export default function Keyboard({ onKey, onBackspace }) {
  return (
    <div className="keyboard" role="group" aria-label="On-screen keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="keyboard-row">
          {ri > 0 && <span className="key-spacer" aria-hidden="true" />}

          {row.map(letter => (
            <button
              key={letter}
              type="button"
              className="key"
              onClick={() => onKey(letter)}
              aria-label={letter}
            >
              {letter}
            </button>
          ))}

          {/* Backspace lives at the end of the bottom row */}
          {ri === ROWS.length - 1 && (
            <button
              type="button"
              className="key key-back"
              onClick={onBackspace}
              aria-label="Backspace"
            >
              ⌫
            </button>
          )}

          {ri > 0 && <span className="key-spacer" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
