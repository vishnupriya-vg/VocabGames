# Hear It · Know It · Spell It — Project Specification

Browser-based vocabulary game for students in Grades 3–8. Built with React + Vite. No backend, no API keys, no external services — entirely client-side.

---

## Tech Stack

- **Framework:** React 18 + Vite
- **Language:** JavaScript (JSX)
- **State:** `useState` and `useReducer` only — no Redux
- **Audio:** Web Speech API (built into browser, free, no key required, works offline)
- **Animations:** CSS transitions only; one exception — lightweight confetti burst for perfect words
- **Storage:** None — everything resets on page refresh
- **Styling:** Plain CSS (or CSS modules) — no UI library

---

## Project Structure (build order)

```
src/
  data/
    wordlist.js          ← all word data, hardcoded, no API calls
  hooks/
    useSpeech.js         ← Web Speech API wrapper
    useTimer.js          ← countdown timer hook
    useScore.js          ← scoring logic + streak tracking
  components/
    HomeScreen.jsx       ← grade selector
    MCQStage.jsx         ← Stage 1: multiple-choice meaning
    SpellingStage.jsx    ← Stage 2: type the word
    Keyboard.jsx         ← virtual QWERTY keyboard
    ConfettiBlast.jsx    ← confetti animation on perfect word
    SessionSummary.jsx   ← final scorecard after Round 5 Word 5
  App.jsx
  main.jsx
  index.css
```

Build in this order:
1. `wordlist.js`
2. `useSpeech.js`
3. `HomeScreen`
4. `MCQStage`
5. `SpellingStage` + `Keyboard`
6. `useTimer`
7. `useScore`
8. `SessionSummary`
9. `ConfettiBlast`

---

## Game Structure

- **Grades:** 3 through 8 (6 grades)
- **Rounds per grade:** 5
- **Words per round:** 5
- **Total words per grade:** 25
- **Words are fixed per round — not randomised**
- No word appears in more than one round within a grade
- No word appears in more than one grade across the entire game
- Every word in the game is unique

### Navigation Flow

```
HomeScreen → (grade selected)
  → Round 1, Word 1
      → Stage 1: MCQ
      → Stage 2: Spelling
  → Round 1, Word 2 ... Word 5
  → Round 2 ... Round 5
  → SessionSummary
```

No round summary screen between rounds — move directly to the next word. The round number and word number are shown in a progress indicator during gameplay.

---

## Word Data (`src/data/wordlist.js`)

Each word entry must contain:

```js
{
  word: "string",
  definition: "string",        // plain language, one sentence, grade-appropriate, does NOT use the word itself
  partOfSpeech: "string",      // e.g. "noun", "verb", "adjective"
  exampleSentence: "string",   // natural sentence with the word spelled out in full
  distractors: ["string", "string", "string"],  // exactly 3 wrong-but-plausible definitions
  grade: 3,                    // number
  round: 1                     // number 1–5
}
```

**Distractors:** Hardcoded in `wordlist.js` — written by Claude Code using its own knowledge. No API call. Must be wrong-but-plausible at the grade reading level: believable to a student who doesn't know the word, clearly wrong to one who does.

**Example sentences:** Stored in `wordlist.js` but shown **only** on the final Session Summary scorecard — **never** during active gameplay (not during MCQ, not during Spelling).

---

## Word List (all 150 words, unique across all grades)

### Grade 3
- R1: actually, appear, brave, gentle, kind
- R2: comfort, discover, honest, loyal, protect
- R3: familiar, grateful, generous, important, ordinary
- R4: cautious, century, character, courage, curious
- R5: accomplish, construct, determine, advantage, describe

### Grade 4
- R1: significant, immediate, abundant, capable, essential
- R2: demonstrate, eliminate, establish, indicate, maintain
- R3: comprehend, conclude, clarify, conceal, anticipate
- R4: characteristic, diligent, enthusiastic, prohibit, investigate
- R5: communicate, examine, drastic, fabulous, obstacles

### Grade 5
- R1: benefit, conflict, evident, authentic, elaborate
- R2: contribute, deceive, distinguish, encounter, formidable
- R3: fragile, hesitate, illuminate, immense, inevitable
- R4: magnificent, manipulate, meticulous, neutral, neglect
- R5: contaminate, fraudulent, indifferent, monotonous, intervene

### Grade 6
- R1: advocate, credible, ethical, eloquent, feasible
- R2: compassionate, explicit, imminent, contemplate, equitable
- R3: fundamental, impartial, persevere, ambivalent, eradicate
- R4: fluctuate, inherent, pragmatic, arduous, cynical
- R5: scrutinize, predominant, resilient, mitigate, obscure

### Grade 7
- R1: abstract, arbitrary, coherent, dormant, ephemeral
- R2: adamant, adversary, brevity, conspicuous, debilitate
- R3: disdain, esoteric, fervent, gregarious, exacerbate
- R4: fallacious, impetuous, inadvertent, irrevocable, corroborate
- R5: enunciate, indispensable, incessant, intermittent, embellish

### Grade 8
- R1: ambiguous, apathy, audacious, austere, benevolent
- R2: capricious, coherent, condescending, copious, deferential
- R3: aberration, alacrity, assiduous, avarice, clandestine
- R4: acumen, altruistic, conciliatory, diffident, didactic
- R5: animosity, apprehensive, archaic, ascertain, astute

---

## Stage 1 — MCQ (Meaning)

1. The word is spoken aloud immediately when the stage loads via Web Speech API.
2. **Audio button** is always visible and can be replayed unlimited times — never hide or disable it at any point during Stage 1 or Stage 2.
3. Display 4 shuffled options: 1 correct definition + 3 distractors (shuffled fresh each time).
4. **Timer:** 30 seconds, starts after the first audio play.
5. **Hint system:**
   - Hint 1 — eliminates one wrong option (one distractor tile greyed out + unclickable). Costs 50% of MCQ points.
   - Hint 2 — reveals part of speech from `partOfSpeech` field (e.g. "This word is a verb"). Costs another 25% of MCQ points.
   - Hint 3 — reveals the correct answer AND locks all tiles (no clicking allowed). MCQ points = 0.
6. Full points for no hints, partial for 1–2 hints, zero for Hint 3.
7. Wrong answer = 0 MCQ points.

---

## Stage 2 — Spelling

1. Show the word as blank dashes — one dash per letter — no letters pre-filled.
2. **Virtual QWERTY keyboard** rendered on screen — no physical keyboard input required (though physical keyboard may also work).
3. Tapping a key places the letter into the next empty dash slot (left to right).
4. Backspace removes the last placed letter. Backspace cannot remove a letter locked in by a spelling hint.
5. **Check button** triggers attempt evaluation.
6. **Evaluation colours:** correct letter in correct position = green | correct letter in wrong position = amber | wrong letter = red.
7. **Attempt counter:** 3 attempts shown as dots ●●● — each failed attempt removes one dot.
8. **Spelling hints:** Reveal one letter in its correct position — that letter is locked (shown differently, cannot be removed by backspace). Each spelling hint reduces spelling points by 30.
9. **Timer:** 60 seconds.
10. After 3 failed attempts: animate the correct spelling letter-by-letter into the dash row, then show Home and Next Word buttons (or See Results if this was the last word). No further attempts allowed.
11. **Audio button** remains visible and fully functional throughout Stage 2 — unlimited replays.

---

## Scoring

### MCQ Points
| Condition | Points |
|-----------|--------|
| Correct, no hints | 100 |
| Correct, 1 hint | 50 |
| Correct, 2 hints | 25 |
| Hint 3 used (answer revealed) | 0 |
| Wrong answer | 0 |

### Spelling Points
| Condition | Points |
|-----------|--------|
| Correct, 1st attempt, no spelling hints | 150 |
| Each spelling hint used | −30 per hint |
| Correct, 2nd attempt | 75 |
| Correct, 3rd attempt | 25 |
| All 3 attempts failed | 0 |

### Time Bonus (only on correct answers)
- MCQ: `Math.floor((secondsRemaining / 30) * 50)` — up to 50 pts
- Spelling: `Math.floor((secondsRemaining / 60) * 50)` — up to 50 pts

### Streak Multiplier
- 3 consecutive perfect words → 1.2× total accumulated points
- 5 consecutive perfect words → 1.5× total accumulated points
- Resets on any hint used or any wrong answer
- **Perfect word** = MCQ correct with no hints + spelling correct on first attempt with no spelling hints

### Confetti
Trigger a confetti burst (`ConfettiBlast`) on every perfect word.

---

## Session Summary (after Round 5, Word 5)

- Animated score count-up to final score
- **Star rating:**
  - 1 star — session completed
  - 2 stars — score above 60% of possible maximum
  - 3 stars — score above 85% of possible maximum
- **Scrollable table of all 25 words:**
  - Word
  - Correct definition
  - Example sentence (full sentence — first time this is shown)
  - MCQ result: correct/wrong + hints used
  - Spelling result: correct/failed + attempts used
  - Outcome: **Perfect** / **Partial** / **Missed**
- **Buttons:** Play Again (same grade) | Choose Grade | Home

---

## Web Speech API (`useSpeech.js`)

```js
utterance.rate  = 0.85   // slightly slower so students hear each syllable
utterance.pitch = 1.0
utterance.lang  = 'en-US'
```

- Load voices using the `voiceschanged` event on mount.
- Prefer a Google or Natural voice if available.
- No API key, no network call — built into the browser.

---

## UI / UX Rules

- All tap targets minimum **44×44px** (mobile-friendly).
- No drag-and-drop — tapping a keyboard key places the letter.
- No user accounts, no login, no persistent storage.
- CSS transitions only for animations — no heavy animation libraries.
- Exception: lightweight confetti burst (`ConfettiBlast.jsx`) for perfect words.
- No grade locking, no spaced repetition, no offline/PWA mode, no accessibility toggles.

---

## Screens (exhaustive list — build nothing beyond these)

1. **HomeScreen** — grade buttons (Grade 3–8)
2. **MCQStage** — per-word Stage 1
3. **SpellingStage** — per-word Stage 2
4. **SessionSummary** — final scorecard

There is no login screen, no settings screen, no leaderboard, no round summary screen between rounds.

---

## Constraints

- No API keys anywhere in this project.
- No external services, no network calls.
- No Redux — useState/useReducer only.
- No drag-and-drop input.
- No user accounts or persistent storage.
- No features not listed in this document.
