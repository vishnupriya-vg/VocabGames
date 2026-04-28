import { useState, useEffect, useCallback } from 'react';
import { randomStartWord } from './data/startWords';
import { isValidWord, addLetter, removeLetter, replaceLetter } from './utils/wordUtils';
import ModeSelect from './components/ModeSelect';
import WordTiles from './components/WordTiles';
import OperationButtons from './components/OperationButtons';
import LetterPicker from './components/LetterPicker';
import WordChain from './components/WordChain';
import GameOver from './components/GameOver';
import './App.css';

const TIMER_SECONDS = 60;

function freshGame(mode) {
  const start = randomStartWord();
  return {
    mode,
    startWord: start,
    currentWord: start,
    chain: [start],
    usedWords: new Set([start]),
    score: 0,
    timeLeft: TIMER_SECONDS,
    selectedOp: null,
    selectedPos: null,
    errorMsg: '',
    over: false,
  };
}

export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' | 'mode' | 'game'
  const [game, setGame] = useState(null);

  // Countdown timer
  useEffect(() => {
    if (!game || game.mode !== 'timed' || game.over || screen !== 'game') return;
    if (game.timeLeft <= 0) {
      setGame(g => ({ ...g, over: true }));
      return;
    }
    const id = setInterval(() => {
      setGame(g => {
        if (!g || g.over) return g;
        const next = g.timeLeft - 1;
        return { ...g, timeLeft: next, over: next <= 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [game?.mode, game?.over, screen]);

  const startGame = useCallback((mode) => {
    setGame(freshGame(mode));
    setScreen('game');
  }, []);

  const playAgain = useCallback(() => {
    setGame(freshGame(game.mode));
  }, [game?.mode]);

  function handleSelectOp(op) {
    setGame(g => ({ ...g, selectedOp: op, selectedPos: null, errorMsg: '' }));
  }

  function handleCancelOp() {
    setGame(g => ({ ...g, selectedOp: null, selectedPos: null, errorMsg: '' }));
  }

  function handleSelectPos(pos) {
    if (game.selectedOp === 'remove') {
      applyMove(removeLetter(game.currentWord, pos));
    } else {
      setGame(g => ({ ...g, selectedPos: pos, errorMsg: '' }));
    }
  }

  function handlePickLetter(ch) {
    const { selectedOp, selectedPos, currentWord } = game;
    const newWord =
      selectedOp === 'add'
        ? addLetter(currentWord, selectedPos, ch)
        : replaceLetter(currentWord, selectedPos, ch);
    applyMove(newWord);
  }

  function applyMove(newWord) {
    if (!isValidWord(newWord)) {
      setGame(g => ({ ...g, errorMsg: `"${newWord}" is not a valid word.`, selectedPos: null }));
      return;
    }
    if (game.usedWords.has(newWord)) {
      setGame(g => ({ ...g, errorMsg: `"${newWord}" already used — try something new!`, selectedPos: null }));
      return;
    }
    setGame(g => ({
      ...g,
      currentWord: newWord,
      chain: [...g.chain, newWord],
      usedWords: new Set([...g.usedWords, newWord]),
      score: g.score + 1,
      selectedOp: null,
      selectedPos: null,
      errorMsg: '',
    }));
  }

  function handleUndo() {
    setGame(g => {
      if (g.chain.length <= 1) return g;
      const newChain = g.chain.slice(0, -1);
      const removed = g.chain[g.chain.length - 1];
      const newUsed = new Set(g.usedWords);
      newUsed.delete(removed);
      return {
        ...g,
        chain: newChain,
        currentWord: newChain[newChain.length - 1],
        usedWords: newUsed,
        score: g.score - 1,
        selectedOp: null,
        selectedPos: null,
        errorMsg: '',
      };
    });
  }

  // ── Screens ──────────────────────────────────────────────────────────────

  if (screen === 'menu') {
    return (
      <div className="app">
        <div className="menu-screen">
          <h1 className="menu-title">Word<br />Chain</h1>
          <p className="menu-subtitle">
            Start from a given word and build a chain by<br />
            <strong>adding</strong>, <strong>removing</strong>, or <strong>replacing</strong> one letter at a time.<br />
            Every new valid word earns a point.
          </p>
          <div className="menu-example">
            <span className="menu-example-label">Example chain</span>
            <div className="menu-example-path">
              {['cat','bat','ban','bane','lane','line'].map((w, i, arr) => (
                <span key={i}>
                  <span className="menu-example-word">{w}</span>
                  {i < arr.length - 1 && <span className="menu-example-arrow">→</span>}
                </span>
              ))}
            </div>
          </div>
          <button className="btn btn--primary btn--large" onClick={() => setScreen('mode')}>
            Play
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'mode') {
    return (
      <div className="app">
        <ModeSelect onSelect={startGame} onBack={() => setScreen('menu')} />
      </div>
    );
  }

  if (screen === 'game' && game) {
    const needsLetterPicker =
      (game.selectedOp === 'add' && game.selectedPos !== null) ||
      (game.selectedOp === 'replace' && game.selectedPos !== null);

    const currentLetter =
      game.selectedOp === 'replace' && game.selectedPos !== null
        ? game.currentWord[game.selectedPos]
        : null;

    const timerPct = game.mode === 'timed' ? (game.timeLeft / TIMER_SECONDS) * 100 : null;
    const timerWarning = game.mode === 'timed' && game.timeLeft <= 10;

    return (
      <div className="app">
        <header className="game-header">
          <button className="btn-back" onClick={() => setScreen('menu')}>← Menu</button>
          <div className="header-score">
            <span className="header-score__num">{game.score}</span>
            <span className="header-score__label">pts</span>
          </div>
          {game.mode === 'timed' && (
            <div className={`header-timer ${timerWarning ? 'header-timer--warn' : ''}`}>
              {game.timeLeft}s
            </div>
          )}
          {game.mode === 'endless' && (
            <div className="header-badge">∞</div>
          )}
        </header>

        {game.mode === 'timed' && (
          <div className="timer-bar">
            <div
              className={`timer-bar__fill ${timerWarning ? 'timer-bar__fill--warn' : ''}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        )}

        <main className="game-main">
          <div className="start-word-label">
            Started from: <strong>{game.startWord}</strong>
          </div>

          <WordChain chain={game.chain} />

          <div className="current-section">
            <div className="current-label">Current word</div>
            <WordTiles
              word={game.currentWord}
              selectedOp={game.selectedOp}
              selectedPos={game.selectedPos}
              onSelectPos={handleSelectPos}
            />
          </div>

          {game.errorMsg && (
            <div className="error-msg">{game.errorMsg}</div>
          )}

          {!needsLetterPicker && (
            <OperationButtons
              selectedOp={game.selectedOp}
              onSelect={handleSelectOp}
              onCancel={handleCancelOp}
            />
          )}

          {game.selectedOp === 'add' && game.selectedPos === null && (
            <p className="instruction">Tap <strong>+</strong> to choose where to insert</p>
          )}
          {game.selectedOp === 'remove' && (
            <p className="instruction">Tap a letter to <strong>remove</strong> it</p>
          )}
          {game.selectedOp === 'replace' && game.selectedPos === null && (
            <p className="instruction">Tap a letter to <strong>replace</strong> it</p>
          )}

          {needsLetterPicker && (
            <LetterPicker onPick={handlePickLetter} disabledLetter={currentLetter} />
          )}

          <div className="game-actions">
            <button className="btn btn--ghost" onClick={handleUndo} disabled={game.chain.length <= 1}>
              ↩ Undo
            </button>
            {game.mode === 'endless' && (
              <button className="btn btn--ghost btn--danger" onClick={() => setGame(g => ({ ...g, over: true }))}>
                End Game
              </button>
            )}
          </div>
        </main>

        {game.over && (
          <GameOver
            score={game.score}
            chain={game.chain}
            mode={game.mode}
            onPlayAgain={playAgain}
            onMenu={() => setScreen('menu')}
          />
        )}
      </div>
    );
  }

  return null;
}
