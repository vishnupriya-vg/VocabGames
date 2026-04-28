import styles from './SummaryScreen.module.css';
interface RoundResult {
  roundNumber: number;
  targetWord: string;
  targetMeaning: string;
  matchWord: string;
  matchMeaning: string;
  relationship: 'synonym' | 'antonym';
  distractors: { word: string; meaning: string }[];
  gotCorrect: boolean;
};

interface SummaryScreenProps {
  results: RoundResult[];
  onPlayAgain: () => void;
}

export function SummaryScreen({ results, onPlayAgain }: SummaryScreenProps) {
  const score = results.filter(r => r.gotCorrect).length;
  const total = results.length;
  const pct = Math.round((score / total) * 100);

  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '💪' : '📖';
  const message =
    pct === 100 ? 'Perfect round! Incredible!' :
    pct >= 70 ? 'Great job! Keep it up!' :
    pct >= 40 ? 'Good effort! Keep practicing!' :
    'Every mistake is a lesson. Keep going!';

  return (
    <div className={styles.container}>
      <div className={styles.scoreSection}>
        <div className={styles.emoji}>{emoji}</div>
        <div className={styles.scoreText}>{score} / {total}</div>
        <div className={styles.pct}>{pct}% correct</div>
        <div className={styles.message}>{message}</div>
      </div>

      <div className={styles.recap}>
        <div className={styles.recapTitle}>Round Recap</div>
        {results.map((r) => (
          <div key={r.roundNumber} className={styles.recapRow}>
            <span className={styles.recapRound}>R{r.roundNumber}</span>
            <span className={styles.recapPair}>
              {r.targetWord} {r.relationship === 'antonym' ? '⟺' : '≈'} {r.matchWord}
            </span>
            <span className={`${styles.recapIcon} ${r.gotCorrect ? styles.recapCorrect : styles.recapWrong}`}>
              {r.gotCorrect ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.playAgainBtn} onClick={onPlayAgain}>
          🔁 Play Again
        </button>
      </div>
    </div>
  );
}
