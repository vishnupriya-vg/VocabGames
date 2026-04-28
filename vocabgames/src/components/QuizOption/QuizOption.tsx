import styles from './QuizOption.module.css';

type State = 'idle' | 'correct' | 'wrong' | 'reveal';

interface Props {
  text: string;
  state: State;
  label: string; // A / B / C / D
  onClick: () => void;
  disabled: boolean;
}

export function QuizOption({ text, state, label, onClick, disabled }: Props) {
  return (
    <button
      className={`${styles.option} ${styles[state]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Option ${label}: ${text}`}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.text}>{text}</span>
      {state === 'correct' && <span className={styles.icon}>✓</span>}
      {state === 'wrong' && <span className={styles.icon}>✗</span>}
    </button>
  );
}
