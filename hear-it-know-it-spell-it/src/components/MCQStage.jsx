import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useTimer } from '../hooks/useTimer';
import WordTrack from './WordTrack.jsx';
import './MCQStage.css';

function articleFor(pos) {
  return /^[aeiou]/i.test(pos) ? 'an' : 'a';
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// result shape: { correct, hintsUsed, points, secondsLeft }
export default function MCQStage({ wordData, onComplete }) {
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
  const [heardOnce, setHeardOnce]           = useState(false);

  const hintsUsedRef     = useRef(0);
  const completedRef     = useRef(false);
  const pendingResultRef = useRef(null);

  useEffect(() => {
    completedRef.current = false;   // reset on every (re)mount, including Strict Mode remount
    return () => { completedRef.current = true; };
  }, []);

  function finish(result) {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete(result);
  }

  function handleExpire() {
    if (completedRef.current) return;
    pendingResultRef.current = {
      correct: false,
      hintsUsed: hintsUsedRef.current,
      points: 0,
      secondsLeft: 0,
    };
    setAnswered(true);
  }

  const { secondsLeft, start: startTimer, stop: stopTimer } = useTimer(30, {
    onExpire: handleExpire,
  });

  // Start timer immediately on mount
  useEffect(() => { startTimer(); }, [startTimer]);

  const { speak, isSpeaking } = useSpeech(wordData.word);

  const triggerSpeak = useCallback(() => {
    speak();
    setHeardOnce(true);
  }, [speak]);

  function handleSelect(idx) {
    if (answered || answerRevealed || idx === eliminatedIdx) return;

    const correct = options[idx].isCorrect;
    const base    = [100, 50, 25, 0][Math.min(hintsUsedRef.current, 3)];
    const timeBonus = correct ? Math.floor((secondsLeft / 30) * 50) : 0;
    const points  = correct ? base + timeBonus : 0;

    pendingResultRef.current = { correct, hintsUsed: hintsUsedRef.current, points, secondsLeft };
    setSelectedIdx(idx);
    setAnswered(true);
    stopTimer();
  }

  function handleHint() {
    if (answered || hintsUsed >= 3) return;
    const next = hintsUsed + 1;
    hintsUsedRef.current = next;
    setHintsUsed(next);

    if (next === 1) {
      const candidates = options
        .map((_, i) => i)
        .filter(i => !options[i].isCorrect && i !== eliminatedIdx);
      setEliminatedIdx(candidates[Math.floor(Math.random() * candidates.length)]);
    } else if (next === 2) {
      setPosRevealed(true);
    } else {
      setAnswerRevealed(true);
      stopTimer();
    }
  }

  function handleAdvance() {
    if (answerRevealed) {
      finish({ correct: false, hintsUsed: hintsUsedRef.current, points: 0, secondsLeft });
    } else {
      finish(pendingResultRef.current);
    }
  }

  function getOptionClass(idx) {
    if (idx === eliminatedIdx)                    return 'option-eliminated';
    if (answerRevealed && options[idx].isCorrect) return 'option-revealed';
    if (answered) {
      if (options[idx].isCorrect) return 'option-correct';
      if (idx === selectedIdx)    return 'option-wrong';
    }
    return '';
  }

  const timerPct    = (secondsLeft / 30) * 100;
  const timerClass  = secondsLeft <= 5 ? 'danger' : secondsLeft <= 10 ? 'warning' : '';
  const showHint    = !answered && !answerRevealed && hintsUsed < 3;
  const showAdvance = answered || answerRevealed;
  const isCorrect   = selectedIdx !== null && options[selectedIdx]?.isCorrect;

  const mcqOutcome = answered
    ? (isCorrect ? 'correct' : 'wrong')
    : answerRevealed ? 'wrong'
    : null;

  const hintLabels = [
    '💡 Use Hint · −50 pts',
    '💡 Use Hint · −25 pts',
    '💡 Reveal Answer (0 pts for this word)',
  ];

  return (
    <div className="mcq-stage">

      {/* Word Track */}
      <WordTrack heard={heardOnce} mcqOutcome={mcqOutcome} spellOutcome={null} />

      {/* Timer */}
      <div className="timer-row">
        <div className="timer-track">
          <div className={`timer-fill ${timerClass}`} style={{ width: `${timerPct}%` }} />
        </div>
        <span className={`timer-secs ${timerClass}`}>{secondsLeft}s</span>
      </div>

      {/* Audio button */}
      <div className="audio-row">
        <button
          className={`audio-btn${isSpeaking ? ' speaking' : ''}`}
          onClick={triggerSpeak}
          aria-label="Hear the word"
        >
          <SpeakerIcon />
          <span>{isSpeaking ? '🎧 Listening…' : '🎧 Tap to hear the word'}</span>
        </button>

        <div className="mcq-instructions">
          <p>Listen to the word, then choose the correct meaning.</p>
          <p>You can replay as many times as you like!</p>
        </div>

        {posRevealed && (
          <p className="pos-hint">
            This word is {articleFor(wordData.partOfSpeech)} <strong>{wordData.partOfSpeech}</strong>
          </p>
        )}
      </div>

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

      {/* Hint button — below options, hidden after answering */}
      {showHint && (
        <div className="hint-row">
          <button className="hint-btn" onClick={handleHint}>
            {hintLabels[hintsUsed]}
          </button>
        </div>
      )}

      {/* Feedback after answer */}
      {answered && !answerRevealed && (
        <p className={`answer-msg ${isCorrect ? 'msg-correct' : 'msg-wrong'}`}>
          {isCorrect
            ? 'Correct!'
            : secondsLeft === 0
              ? "Time's up — here's the correct answer."
              : "Not quite — here's the correct answer."}
        </p>
      )}

      {/* Hint-3 reveal message */}
      {answerRevealed && (
        <p className="reveal-msg">The correct answer is highlighted above.</p>
      )}

      {/* Manual advance button */}
      {showAdvance && (
        <button className="advance-btn" onClick={handleAdvance}>
          {isCorrect ? 'Next → Spell It!' : 'Continue to Spelling →'}
        </button>
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
