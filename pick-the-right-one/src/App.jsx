import { useReducer } from 'react';
import { getWordsForGrade } from './data/wordlist.js';
import HomeScreen from './components/HomeScreen.jsx';
import GameStage from './components/GameStage.jsx';
import WordResultCard from './components/WordResultCard.jsx';
import SessionSummary from './components/SessionSummary.jsx';

const initial = {
  screen: 'home',
  grade: null,
  wordList: [],
  wordIndex: 0,
  currentHints: 0,
  results: [],
  score: 0,
  streak: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_GRADE': {
      return {
        ...initial,
        screen: 'game',
        grade: action.grade,
        wordList: getWordsForGrade(action.grade),
      };
    }

    case 'USE_HINT': {
      if (state.currentHints >= 2) return state;
      return { ...state, currentHints: state.currentHints + 1 };
    }

    case 'SUBMIT_ANSWER': {
      const word = state.wordList[state.wordIndex];
      const correct = action.choice === word.correct;
      const base = !correct
        ? 0
        : state.currentHints === 0
        ? 100
        : state.currentHints === 1
        ? 50
        : 25;
      const newStreak = correct && state.currentHints === 0 ? state.streak + 1 : 0;
      const mult = newStreak >= 5 ? 1.5 : newStreak >= 3 ? 1.2 : 1.0;
      const points = Math.round(base * mult);
      return {
        ...state,
        score: state.score + points,
        streak: newStreak,
        results: [
          ...state.results,
          {
            wordId: word.id,
            word: word.word,
            correct,
            hintsUsed: state.currentHints,
            points,
            correctSentence: word.correct === 'A' ? word.sentenceA : word.sentenceB,
            explanation: word.explanation,
          },
        ],
        screen: 'wordresult',
      };
    }

    case 'NEXT_WORD': {
      const next = state.wordIndex + 1;
      if (next >= state.wordList.length) {
        return { ...state, screen: 'summary' };
      }
      return { ...state, wordIndex: next, currentHints: 0, screen: 'game' };
    }

    case 'RESET':
      return initial;

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initial);
  const reset = () => dispatch({ type: 'RESET' });

  if (state.screen === 'home') {
    return (
      <HomeScreen
        onSelectGrade={(grade) => dispatch({ type: 'SELECT_GRADE', grade })}
      />
    );
  }

  if (state.screen === 'game') {
    return (
      <GameStage
        key={state.wordIndex}
        word={state.wordList[state.wordIndex]}
        wordIndex={state.wordIndex}
        total={state.wordList.length}
        hints={state.currentHints}
        score={state.score}
        onUseHint={() => dispatch({ type: 'USE_HINT' })}
        onSubmit={(choice) => dispatch({ type: 'SUBMIT_ANSWER', choice })}
        onHome={reset}
      />
    );
  }

  if (state.screen === 'wordresult') {
    return (
      <WordResultCard
        result={state.results[state.results.length - 1]}
        wordIndex={state.wordIndex}
        total={state.wordList.length}
        onNext={() => dispatch({ type: 'NEXT_WORD' })}
        onHome={reset}
      />
    );
  }

  if (state.screen === 'summary') {
    return (
      <SessionSummary
        results={state.results}
        score={state.score}
        grade={state.grade}
        onPlayAgain={() => dispatch({ type: 'SELECT_GRADE', grade: state.grade })}
        onChooseGrade={reset}
        onHome={reset}
      />
    );
  }

  return null;
}
