import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useTimer } from '../hooks/useTimer';
import './MCQStage.css';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// result shape: { correct, hintsUsed, points, secondsLeft }
export default function MCQStage({ wordData, round, wordInRound, onComplete }) {
  const [options] = useState(() =>
    shuffleArray([
      { text: wordData.definition, isCorrect: true },
      ...wordData.distractors.map(text => ({ text, isCorrect: false })),
    ])
  );

  const [hintsUsed, setHintsUsed]           = useState(0);
  const [eliminatedIdx, setEliminatedIdx]   = useState(null);
  const [posRevealed, setPosRevealed]       = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [selectedIdx, setSelectedIdx]       = useState(null);
  const [answered, setAnswered]             = useState(false);

  // Refs for values read inside timer callbacks (avoids stale-closure risk)
  const hintsUsedRef    = useRef(0);
  const completedRef    = useRef(false);
  const timerStartedRef = useRef(false);
  const timeoutRef      = useRef(null);

  useEffect(() => () => {
    clearTimeout(timeoutRef.current);
    completedRef.current = true;
  }, []);

  function finish(result) {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete(result);
  }

  // Called by useTimer when the 30 s run out
  function handleExpire() {
    if (completedRef.current) return;
    setAnswered(true);
    timeoutRef.current = setTimeout(
      () => finish({ correct: false, hintsUsed: hintsUsedRef.current, points: 0, secondsLeft: 0 }),
      2000
    );
  }

  const { secondsLeft, start: startTimer, stop: stopTimer } = useTimer(30, {
    onExpire: handleExpire,
  });

  const { speak, isSpeaking, isReady } = useSpeech(wordData.word);

  const triggerSpeak = useCallback(() => {
    speak();
    if (!timerStartedRef.current) {
      timerStartedRef.current = true;
      startTimer();
    }
  }, [speak, startTimer]);

  // Auto-play as soon as voices are loaded
  useEffect(() => {
    if (isReady) triggerSpeak();
  }, [isReady, triggerSpeak]);

  function handleSelect(idx) {
    if (answered || answerRevealed || idx === eliminatedIdx) return;

    const correct = options[idx].isCorrect;
    setSelectedIdx(idx);
    setAnswered(true);
    stopTimer();

    const base = [100, 50, 25, 0][Math.min(hintsUsedRef.current, 3)];
    const timeBonus = correct ? Math.floor((secondsLeft / 30) * 50) : 0;
    const points = correct ? base + timeBonus : 0;

    timeoutRef.current = setTimeout(
      () => finish({ correct, hintsUsed: hintsUsedRef.current, points, secondsLeft }),
      1500
    );
  }

  function handleHint() {
    if (answered || hintsUsed >= 3) return;
    const next = hintsUsed + 1;
    hintsUsedRef.current = next;
    setHintsUsed(next);

    if (next === 1) {
      // Eliminate a random wrong option that hasn't been eliminated yet
      const candidates = options
        .map((o, i) => i)
        .filter(i => !options[i].isCorrect && i !== eliminatedIdx);
      setEliminatedIdx(candidates[Math.floor(Math.random() * candidates.length)]);
    } else if (next === 2) {
      setPosRevealed(true);
    } else {
      setAnswerRevealed(true);
      stopTimer();
    }
  }

  function handleContinueAfterReveal() {
    finish({ correct: false, hintsUsed: hintsUsedRef.current, points: 0, secondsLeft });
  }

  function getOptionClass(idx) {
    if (idx === eliminatedIdx) return 'option-eliminated';
    // Hint-3 reveal: highlight correct before any click
    if (answerRevealed && options[idx].isCorrect) return 'option-revealed';
    if (answered) {
      if (options[idx].isCorrect) return 'option-correct';
      if (idx === selectedIdx)    return 'option-wrong';
    }
    return '';
  }

  const timerPct   = (secondsLeft / 30) * 100;
  const timerClass = secondsLeft <= 5 ? 'danger' : secondsLeft <= 10 ? 'warning' : '';
  const showHint   = !answered && !answerRevealed && hintsUsed < 3;

  const hintLabels = [
    'Hint: Remove a wrong answer (−50 pts)',
    'Hint: Show part of speech (−25 pts more)',
    'Hint: Reveal the answer (0 pts for this question)',
  ];

  return (
    <div className="mcq-stage">

      {/* Progress */}
      <div className="mcq-progress">
        <span className="mcq-round-label">Round {round}</span>
        <div className="mcq-dots">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`mcq-dot ${i < wordInRound - 1 ? 'done' : i === wordInRound - 1 ? 'current' : ''}`}
            />
          ))}
        </div>
        <span className="mcq-word-label">Word {wordInRound} of 5</span>
      </div>

      {/* Timer */}
      <div className="timer-row">
        <div className="timer-track">
          <div
            className={`timer-fill ${timerClass}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
        <span className={`timer-secs ${timerClass}`}>{secondsLeft}s</span>
      </div>

      {/* Audio button */}
      <div className="audio-row">
        <button
          className={`audio-btn ${isSpeaking ? 'speaking' : ''}`}
          onClick={triggerSpeak}
          aria-label="Hear the word again"
        >
          <SpeakerIcon />
          <span>{isSpeaking ? 'Listening…' : 'Hear the word'}</span>
        </button>

        {posRevealed && (
          <p className="pos-hint">
            This word is a <strong>{wordData.partOfSpeech}</strong>
          </p>
        )}
      </div>

      {/* Question prompt */}
      <p className="mcq-prompt">Choose the correct meaning:</p>

      {/* Options */}
      <div className="options-grid">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${getOptionClass(idx)}`}
            disabled={answered || answerRevealed || idx === eliminatedIdx}
            onClick={() => handleSelect(idx)}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* Feedback message after answering */}
      {answered && !answerRevealed && (
        <p className={`answer-msg ${selectedIdx !== null && options[selectedIdx]?.isCorrect ? 'msg-correct' : 'msg-wrong'}`}>
          {selectedIdx !== null && options[selectedIdx]?.isCorrect
            ? 'Correct!'
            : secondsLeft === 0
              ? "Time’s up—here’s the answer."
              : "Not quite — here’s the correct answer."}
        </p>
      )}

      {/* Hint button */}
      {showHint && (
        <div className="hint-row">
          <button className="hint-btn" onClick={handleHint}>
            {hintLabels[hintsUsed]}
          </button>
        </div>
      )}

      {/* Continue button after hint-3 reveal */}
      {answerRevealed && (
        <div className="reveal-row">
          <p className="reveal-msg">The correct answer is highlighted above.</p>
          <button className="continue-btn" onClick={handleContinueAfterReveal}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
