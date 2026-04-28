import styles from './RoundScorecardScreen.module.css';
export interface RoundResult {
  roundNumber: number;
  targetWord: string;
  targetMeaning: string;
  matchWord: string;
  matchMeaning: string;
  relationship: 'synonym' | 'antonym';
  distractors: { word: string; meaning: string }[];
  gotCorrect: boolean;
}
interface RoundScorecardScreenProps {
  result: RoundResult;
  totalRounds: number;
  onNext: () => void;
}
export function RoundScorecardScreen({ result, totalRounds, onNext }: RoundScorecardScreenProps) {
  const relLabel = result.relationship === 'antonym' ? 'Antonym Pair' : 'Synonym Pair';
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.roundLabel}>Round {result.roundNumber} of {totalRounds}</span>
        <span className={`${styles.badge} ${result.gotCorrect ? styles.correct : styles.wrong}`}>
          {result.gotCorrect ? 'Correct' : 'Missed'}
        </span>
      </div>
      <div className={styles.correctPair}>
        <div className={styles.sectionTitle}>Correct Pair - {relLabel}</div>
        <div className={styles.pairRow}>
          <div className={styles.wordCard}>
            <div className={styles.wordText}>{result.targetWord}</div>
            <div className={styles.meaning}>{result.targetMeaning}</div>
          </div>
          <div className={styles.connector}>
            {result.relationship === 'antonym' ? '<->' : '~'}
          </div>
          <div className={styles.wordCard}>
            <div className={styles.wordText}>{result.matchWord}</div>
            <div className={styles.meaning}>{result.matchMeaning}</div>
          </div>
        </div>
        <div className={styles.whyCorrect}>
          {result.relationship === 'antonym'
            ? `"${result.targetWord}" and "${result.matchWord}" are antonyms - they have opposite meanings.`
            : `"${result.targetWord}" and "${result.matchWord}" are synonyms - they share a similar meaning.`}
        </div>
      </div>
      <div className={styles.distractors}>
        <div className={styles.sectionTitle}>Other Words on the Board</div>
        {result.distractors.map((d, i) => (
          <div key={i} className={styles.distractorRow}>
            <span className={styles.distractorWord}>{d.word}</span>
            <span className={styles.distractorMeaning}>{d.meaning}</span>
          </div>
        ))}
      </div>
      <button className={styles.nextBtn} onClick={onNext}>
        {result.roundNumber === totalRounds ? 'See Final Summary' : 'Next Round'}
      </button>
    </div>
  );
}
