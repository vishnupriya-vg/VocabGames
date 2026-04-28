import { useState, useRef } from 'react';
import type { Word } from '../../types';
import styles from './Flashcard.module.css';

interface Props {
  word: Word;
  onKnow: () => void;
  onSkip: () => void;
  progress: string; // e.g. "3 / 10"
}

export function Flashcard({ word, onKnow, onSkip, progress }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset when word changes
  const prevId = useRef(word.id);
  if (prevId.current !== word.id) {
    prevId.current = word.id;
    if (flipped) setFlipped(false);
    if (swipeDir) setSwipeDir(null);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    touchStartX.current = null;

    // Only treat as horizontal swipe if dx dominates
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

    if (dx > 0) {
      handleKnow();
    } else {
      handleSkip();
    }
  }

  function handleKnow() {
    setSwipeDir('right');
    setTimeout(() => {
      setSwipeDir(null);
      setFlipped(false);
      onKnow();
    }, 350);
  }

  function handleSkip() {
    setSwipeDir('left');
    setTimeout(() => {
      setSwipeDir(null);
      setFlipped(false);
      onSkip();
    }, 350);
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressRow}>
        <span className={styles.progress}>{progress}</span>
        <span className={styles.category}>{word.category}</span>
      </div>

      <div
        className={`${styles.card} ${flipped ? styles.flipped : ''} ${swipeDir ? styles[swipeDir] : ''}`}
        onClick={() => !swipeDir && setFlipped(f => !f)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') handleKnow();
          if (e.key === 'ArrowLeft') handleSkip();
          if (e.key === ' ' || e.key === 'Enter') setFlipped(f => !f);
        }}
        aria-label={`Flashcard: ${word.word}. Press Space to flip, Arrow keys to rate.`}
      >
        <div className={styles.cardInner}>
          {/* Front */}
          <div className={styles.cardFront}>
            <span className={styles.posBadge}>{word.partOfSpeech}</span>
            <h2 className={styles.wordText}>{word.word}</h2>
            <p className={styles.flipHint}>Tap to reveal meaning</p>
          </div>

          {/* Back */}
          <div className={styles.cardBack}>
            <p className={styles.meaning}>{word.meaning}</p>
            <p className={styles.example}>"{word.exampleSentence}"</p>
            {word.synonyms.length > 0 && (
              <div className={styles.synonyms}>
                {word.synonyms.map(s => (
                  <span key={s} className={styles.synonymChip}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swipe indicators */}
      <div className={styles.swipeRow}>
        <button className={styles.swipeBtn} onClick={handleSkip} aria-label="Show again">
          <span className={`${styles.swipeArrow} ${styles.left}`}>←</span>
          <span>Again</span>
        </button>
        <button className={`${styles.swipeBtn} ${styles.knowBtn}`} onClick={handleKnow} aria-label="I know this">
          <span>Know it</span>
          <span className={`${styles.swipeArrow} ${styles.right}`}>→</span>
        </button>
      </div>
    </div>
  );
}
