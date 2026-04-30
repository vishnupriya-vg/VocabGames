import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useTimer } from '../hooks/useTimer';
import Keyboard from './Keyboard.jsx';
import WordTrack from './WordTrack.jsx';
import './SpellingStage.css';

function evaluateAttempt(inputArr, targetStr) {
  const n = targetStr.length;
  const result = Array(n).fill('absent');
  const pool = {};

  for (let i = 0; i < n; i++) {
    if (inputArr[i] === targetStr[i]) {
      result[i] = 'correct';
    } else {
      pool[targetStr[i]] = (pool[targetStr[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < n; i++) {
    if (result[i] !== 'correct' && pool[inputArr[i]] > 0) {
      result[i] = 'present';
      pool[inputArr[i]]--;
    }
  }
  return result;
}

const BASE_POINTS = [150, 75, 25];

function computePoints(attemptIdx, spellingHints, secondsLeft) {
  const base = BASE_POINTS[attemptIdx] ?? 0;
  const afterHints = Math.max(0, base - spellingHints * 30);
  return afterHints + Math.floor((secondsLeft / 60) * 50);
}

export default function SpellingStage({
  wordData,
  mcqOutcome,
  onComplete,
}) {
  const target = wordData.word.toUpperCase();
  const n = target.length;

  const [letters, setLetters]       = useState(() => Array(n).fill(''));
  const [locked, setLocked]         = useState(() => new Set());
  const [attempts, setAttempts]     = useState(0);
  const [evalResult, setEvalResult] = useState(null);
  const [phase, setPhase]           = useState('typing');
  const [hintsUsed, setHintsUsed]   = useState(0);

  const phaseRef       = useRef('typing');
  const attemptsRef    = useRef(0);
  const hintsUsedRef   = useRef(0);
  const lockedRef      = useRef(new Set());
  const completedRef   = useRef(false);
  const resultTimerRef = useRef(null);
  const solveTimerRef  = useRef(null);
  const handlersRef    = useRef(null);

  function setPhaseSync(p)    { phaseRef.current = p;     setPhase(p); }
  function setAttemptsSync(a) { attemptsRef.current = a;  setAttempts(a); }
  function setHintsSync(h)    { hintsUsedRef.current = h; setHintsUsed(h); }

  function syncLock(nextLocked) {
    lockedRef.current = nextLocked;
    setLocked(new Set(nextLocked));
  }

  useEffect(() => () => {
    clearTimeout(resultTimerRef.current);
    clearTimeout(solveTimerRef.current);
    completedRef.current = true;
  }, []);

  function finish(result) {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete(result);
  }

  function handleExpire() {
    const p = phaseRef.current;
    if (p !== 'typing' && p !== 'result') return;
    clearTimeout(resultTimerRef.current);
    setPhaseSync('failed');
  }

  const { secondsLeft, start: startTimer, stop: stopTimer } = useTimer(60, {
    onExpire: handleExpire,
  });

  const { speak, isSpeaking } = useSpeech(wordData.word);
  const timerStartedRef = useRef(false);
  const [heardOnce, setHeardOnce] = useState(false);

  const triggerSpeak = useCallback(() => {
    speak();
    setHeardOnce(true);
    if (!timerStartedRef.current) {
      timerStartedRef.current = true;
      startTimer();
    }
  }, [speak, startTimer]);

  // ── Input handlers ────────────────────────────────────────────────────────

  function handleKey(letter) {
    if (phaseRef.current !== 'typing') return;
    setLetters(prev => {
      const idx = prev.findIndex((l, i) => l === '' && !lockedRef.current.has(i));
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = letter;
      return next;
    });
  }

  function handleBackspace() {
    if (phaseRef.current !== 'typing') return;
    setLetters(prev => {
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i] !== '' && !lockedRef.current.has(i)) {
          const next = [...prev];
          next[i] = '';
          return next;
        }
      }
      return prev;
    });
  }

  function handleCheck() {
    if (phaseRef.current !== 'typing') return;
    if (!letters.every(l => l !== '')) return;

    const result = evaluateAttempt(letters, target);
    const allCorrect = result.every(r => r === 'correct');
    setEvalResult(result);

    if (allCorrect) {
      stopTimer();
      const sl = secondsLeft;
      const pts = computePoints(attemptsRef.current, hintsUsedRef.current, sl);
      setPhaseSync('solved');
      solveTimerRef.current = setTimeout(() => {
        finish({
          correct:     true,
          attempts:    attemptsRef.current,
          hintsUsed:   hintsUsedRef.current,
          points:      pts,
          secondsLeft: sl,
        });
      }, 1200);
    } else {
      const newAttempts = attemptsRef.current + 1;
      setAttemptsSync(newAttempts);
      setPhaseSync('result');

      resultTimerRef.current = setTimeout(() => {
        if (newAttempts >= 3) {
          stopTimer();
          setPhaseSync('failed');
        } else {
          setLetters(prev => prev.map((l, i) => lockedRef.current.has(i) ? l : ''));
          setEvalResult(null);
          setPhaseSync('typing');
        }
      }, 1500);
    }
  }

  function handleSpellingHint() {
    if (phaseRef.current !== 'typing') return;
    const candidates = Array.from({ length: n }, (_, i) => i).filter(
      i => !lockedRef.current.has(i)
    );
    if (candidates.length === 0) return;

    const idx = candidates[Math.floor(Math.random() * candidates.length)];
    const nextLocked = new Set(lockedRef.current);
    nextLocked.add(idx);
    syncLock(nextLocked);
    setHintsSync(hintsUsedRef.current + 1);
    setLetters(prev => {
      const next = [...prev];
      next[idx] = target[idx];
      return next;
    });
  }

  handlersRef.current = { handleKey, handleBackspace, handleCheck };

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const { handleKey, handleBackspace, handleCheck } = handlersRef.current;
      if      (e.key === 'Backspace')       { e.preventDefault(); handleBackspace(); }
      else if (e.key === 'Enter')           { e.preventDefault(); handleCheck(); }
      else if (/^[a-zA-Z]$/.test(e.key))   { handleKey(e.key.toUpperCase()); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────

  const allFilled  = letters.every(l => l !== '');
  const dotsLeft   = Math.max(0, 3 - attempts);
  const timerPct   = (secondsLeft / 60) * 100;
  const timerClass = secondsLeft <= 10 ? 'danger' : secondsLeft <= 20 ? 'warning' : '';
  const canHint    = phase === 'typing' && locked.size < n;
  const showControls = phase !== 'solved' && phase !== 'failed';

  const spellOutcome = phase === 'solved' ? 'correct' : phase === 'failed' ? 'wrong' : null;

  function getCellClass(i) {
    const parts = [];
    if (locked.has(i))                           parts.push('cell-locked');
    else if (letters[i] && phase === 'typing')   parts.push('cell-filled');

    if ((phase === 'result' || phase === 'solved') && evalResult) {
      parts.push(`cell-${evalResult[i]}`);
    }
    if (phase === 'failed') parts.push('cell-reveal');
    return parts.join(' ');
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="spelling-stage">

      {/* Word Track */}
      <WordTrack heard={heardOnce} mcqOutcome={mcqOutcome} spellOutcome={spellOutcome} />

      {/* Timer bar */}
      <div className="timer-row">
        <div className="timer-track">
          <div className={`timer-fill ${timerClass}`} style={{ width: `${timerPct}%` }} />
        </div>
        <span className={`timer-secs ${timerClass}`}>{secondsLeft}s</span>
      </div>

      {/* Audio + attempt dots */}
      <div className="spell-top-row">
        <button
          className={`audio-btn${isSpeaking ? ' speaking' : ''}`}
          onClick={triggerSpeak}
          aria-label="Hear the word again"
        >
          <SpeakerIcon />
          <span>{isSpeaking ? '🎧 Listening…' : '🎧 Tap to hear the word'}</span>
        </button>

        <div className="attempt-dots" aria-label={`${dotsLeft} of 3 attempts remaining`}>
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={`attempt-dot ${i < dotsLeft ? 'active' : 'used'}`} />
          ))}
        </div>
      </div>

      {/* Dash row */}
      <div className="dash-row">
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className={`dash-cell ${getCellClass(i)}`}
            style={phase === 'failed' ? { animationDelay: `${i * 0.08}s` } : undefined}
          >
            {phase === 'failed' ? target[i] : (letters[i] || '')}
          </div>
        ))}
      </div>

      {/* Phase feedback */}
      {phase === 'solved' && (
        <p className="spell-feedback spell-correct">Correct! ✓</p>
      )}
      {phase === 'failed' && (
        <p className="spell-feedback spell-failed">The correct spelling is shown above.</p>
      )}

      {/* Check + hint */}
      {showControls && (
        <div className="spell-actions">
          <button
            className="check-btn"
            disabled={!allFilled || phase !== 'typing'}
            onClick={handleCheck}
          >
            Check
          </button>

          {canHint && (
            <button className="spell-hint-btn" onClick={handleSpellingHint}>
              Reveal a letter (−30 pts)
            </button>
          )}
        </div>
      )}

      {/* Continue after failed */}
      {phase === 'failed' && (
        <button
          className="btn-continue"
          onClick={() =>
            finish({
              correct:    false,
              attempts:   attemptsRef.current,
              hintsUsed:  hintsUsedRef.current,
              points:     0,
              secondsLeft,
            })
          }
        >
          Continue →
        </button>
      )}

      {/* Virtual keyboard */}
      {showControls && (
        <Keyboard onKey={handleKey} onBackspace={handleBackspace} />
      )}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
