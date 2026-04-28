export default function WordTiles({
  word,
  selectedOp,
  selectedPos,
  onSelectPos,
}) {
  if (!selectedOp) {
    return (
      <div className="word-tiles">
        {word.split('').map((ch, i) => (
          <span key={i} className="tile">{ch}</span>
        ))}
      </div>
    );
  }

  if (selectedOp === 'remove' || (selectedOp === 'replace' && selectedPos === null)) {
    return (
      <div className="word-tiles">
        {word.split('').map((ch, i) => (
          <button
            key={i}
            className={`tile tile--interactive ${selectedPos === i ? 'tile--selected' : ''}`}
            onClick={() => onSelectPos(i)}
          >
            {ch}
          </button>
        ))}
      </div>
    );
  }

  if (selectedOp === 'replace' && selectedPos !== null) {
    return (
      <div className="word-tiles">
        {word.split('').map((ch, i) => (
          <span key={i} className={`tile ${i === selectedPos ? 'tile--selected' : ''}`}>
            {i === selectedPos ? '_' : ch}
          </span>
        ))}
      </div>
    );
  }

  if (selectedOp === 'add') {
    const tiles = [];
    // Insertion point before each letter, and after the last
    for (let i = 0; i <= word.length; i++) {
      tiles.push(
        <button
          key={`ins-${i}`}
          className={`tile-insert ${selectedPos === i ? 'tile-insert--selected' : ''}`}
          onClick={() => onSelectPos(i)}
          title={`Insert here`}
        >
          +
        </button>
      );
      if (i < word.length) {
        tiles.push(
          <span key={`ch-${i}`} className="tile">{word[i]}</span>
        );
      }
    }
    return <div className="word-tiles word-tiles--add">{tiles}</div>;
  }

  return null;
}
