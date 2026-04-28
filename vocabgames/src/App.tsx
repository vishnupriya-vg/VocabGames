import { useGame } from './store/useGame';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { LevelMapScreen } from './screens/LevelMapScreen/LevelMapScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen/ModeSelectScreen';
import { WordMatchScreen } from './screens/WordMatchScreen/WordMatchScreen';
import { QuizScreen } from './screens/QuizScreen/QuizScreen';
import { FillBlankScreen } from './screens/FillBlankScreen/FillBlankScreen';
import { ResultsScreen } from './screens/ResultsScreen/ResultsScreen';
import { ProfileScreen } from './screens/ProfileScreen/ProfileScreen';
import { BottomNav } from './components/BottomNav/BottomNav';

const GAME_SCREENS = new Set(['WORD_MATCH', 'QUIZ', 'FILL_BLANK', 'RESULTS', 'MODE_SELECT']);

export default function App() {
  const { state } = useGame();
  const { screen, toast } = state;

  const showNav = !GAME_SCREENS.has(screen);

  function renderScreen() {
    switch (screen) {
      case 'HOME':        return <HomeScreen />;
      case 'LEVEL_MAP':   return <LevelMapScreen />;
      case 'MODE_SELECT': return <ModeSelectScreen />;
      case 'WORD_MATCH':  return <WordMatchScreen />;
      case 'QUIZ':        return <QuizScreen />;
      case 'FILL_BLANK':  return <FillBlankScreen />;
      case 'RESULTS':     return <ResultsScreen />;
      case 'PROFILE':     return <ProfileScreen />;
      default:            return <HomeScreen />;
    }
  }

  return (
    <div className="app-container">
      {renderScreen()}
      {showNav && <BottomNav />}
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
