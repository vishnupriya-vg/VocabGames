import { useEffect, useRef } from 'react';

export default function WordChain({ chain }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chain.length]);

  return (
    <div className="word-chain">
      {chain.map((word, i) => (
        <span key={i} className="chain-step">
          <span className={`chain-word ${i === chain.length - 1 ? 'chain-word--current' : ''} ${i === 0 ? 'chain-word--start' : ''}`}>
            {word}
          </span>
          {i < chain.length - 1 && <span className="chain-arrow">→</span>}
        </span>
      ))}
      <div ref={endRef} />
    </div>
  );
}
