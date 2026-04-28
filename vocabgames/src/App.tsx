import { useGame } from './store/useGame';
import { WordMatchScreen } from './screens/WordMatchScreen/WordMatchScreen';

// Standalone Word Match app — only renders the Word Match game
export default function App() {
  const { state } = useGame();
  const { toast } = state;

  return (
    <div className="app-container">
      <WordMatchScreen />
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '14px',
            zIndex: 999,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px var(--shadow)',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
