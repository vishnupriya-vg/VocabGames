# Pick the Right One — Game Specification

Browser-based vocabulary game. Players identify which of two sentences uses a highlighted word correctly.
Stack: React 19 + Vite + plain CSS. No Redux, no external services, no API keys.

---

## Project structure

```
pick-the-right-one/
├── CLAUDE.md
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx              # top-level state machine
    ├── index.css            # global resets and CSS variables
    ├── data/
    │   └── wordlist.js      # all 30 words, hardcoded
    └── components/
        ├── HomeScreen.jsx
        ├── GameStage.jsx    # main word screen
        ├── WordResultCard.jsx
        ├── SessionSummary.jsx
        └── ConfettiBlast.jsx
```

---

## Colour palette (shared across VocabGames monorepo)

| Token              | Hex       |
|--------------------|-----------|
| Primary accent     | `#534AB7` |
| Correct green      | `#1D9E75` |
| Incorrect red      | `#E24B4A` |
| Amber / hint       | `#EF9F27` |
| Background         | `#F5F5F5` |
| Card background    | `#FFFFFF` |
| Text primary       | `#1A1A2E` |

Define all as CSS custom properties on `:root`.

---

## Game structure

- **Grades**: 3, 4, 5, 6, 7, 8 (shown as buttons on Home screen)
- **Words per grade**: 5
- **Total words**: 30 across all grades
- **No rounds, no mode selection** — selecting a grade starts a fixed session of 5 words
- **No word repeats** across any grade

---

## Screen flow

```
HomeScreen
  → (grade selected) → GameStage [5-word loop]
    → (after each word) → WordResultCard
      → (after word 5) → SessionSummary
        → Play Again / Choose Grade / Home
```

Every screen after HomeScreen has a small **⌂ Home** text button in the top-left that returns to grade selection (resets all session state).

---

## HomeScreen

- Title: "Pick the Right One"
- Subtitle: "Which sentence uses the word correctly?"
- Grade buttons: Grade 3 through Grade 8 (large tap targets, ≥44×44 px)
- Tapping a grade goes directly to GameStage — no intermediate screen

---

## GameStage — core word screen

One word at a time.

### Layout
- Word displayed at top in large text with its part of speech (e.g. *brave — adjective*)
- Progress indicator: "Word 2 of 5"
- Two sentence cards side by side on desktop, stacked on mobile
  - **Sentence A** card
  - **Sentence B** card
- The vocabulary word is highlighted in both sentences: bold text + coloured pill background (`#534AB7` tinted, e.g. `rgba(83,74,183,0.15)` background with `#534AB7` text)
- Hint buttons below sentences
- Score display in top-right

### Interaction — before answer
- Player taps a sentence card
- No timer pressure

### Hint system (before answer only)
- **Hint 1** — "Show Definition" — reveals the word's definition. Costs 50% of base points.
- **Hint 2** — "Eliminate" — adds a subtle red tint overlay to the incorrect sentence card (does NOT reveal the answer directly). Costs another 25% of base points.
- Maximum 2 hints per word.
- Hint buttons are disabled after an answer is submitted.

### After tapping (feedback state)
- Correct sentence card glows **green** border + green background tint
- Incorrect sentence card glows **red** border + red background tint
- A one-line explanation appears below the cards explaining why the correct answer is right
- Points animate up from the correct sentence card when earned (CSS keyframe)
- **"Next Word →"** button appears — player must tap to advance

---

## WordResultCard

Shown after each word, before advancing. Content:
- Word in large text
- Whether they got it right or wrong (icon + colour)
- Points earned with breakdown (e.g. "100 pts — no hints used" or "50 pts — 1 hint used")
- The correct sentence shown in full, with the word highlighted green
- One-line explanation of why it is correct
- Button: **"Next Word →"** (words 1–4) or **"See Final Results →"** (word 5)

---

## SessionSummary (final screen)

- Animated score count-up (CSS, no library needed)
- **Star rating**:
  - 1 star: completed the session
  - 2 stars: above 60% of maximum possible score
  - 3 stars: above 85% of maximum possible score
- Confetti burst (`ConfettiBlast`) fires if 3 stars earned
- Scrollable table — one row per word played:
  - Word | Correct sentence | Got it right? | Hints used | Points earned
- Buttons: **Play Again** (same grade), **Choose Grade** (back to HomeScreen), **Home**

---

## Scoring

| Outcome | Points |
|---------|--------|
| Correct, no hints | 100 |
| Correct, 1 hint | 50 |
| Correct, 2 hints | 25 |
| Wrong answer | 0 |

**Streak multiplier** (applied to final word score):
- 3 correct in a row: ×1.2
- 5 correct in a row: ×1.5
- Resets on any wrong answer or any hint used

Maximum possible score per 5-word session: 500 pts (all correct, no hints, no streak) up to 750 pts with full streak multiplier.

---

## ConfettiBlast component

Lightweight CSS-only confetti burst. Fired once when 3-star rating is earned on SessionSummary. No external animation libraries. Implement with a fixed-position overlay, ~40 `<span>` elements with randomised `animation-delay`, `left`, `background-color` (use palette colours), and a CSS `@keyframes` that moves them downward + rotates.

---

## State management

Use `useState` and `useReducer` only — no Redux, no Zustand.

Top-level state in `App.jsx` (managed with `useReducer`):

```js
{
  screen: 'home' | 'game' | 'wordresult' | 'summary',
  grade: null | 3..8,
  wordList: [],          // 5 word objects for this session
  wordIndex: 0,          // current position in wordList (0–4)
  currentHints: 0,       // hints used on current word (0, 1, or 2)
  answeredCorrect: null, // null | true | false
  results: [],           // { wordId, correct, hintsUsed, points } per completed word
  score: 0,              // running total
  streak: 0,             // current streak count
}
```

Dispatch actions: `SELECT_GRADE`, `USE_HINT`, `SUBMIT_ANSWER`, `NEXT_WORD`, `RESET`.

---

## wordlist.js format

```js
// src/data/wordlist.js
export const WORDS = [
  {
    id: 'g3_actually',
    grade: 3,
    word: 'actually',
    partOfSpeech: 'adverb',
    definition: '...',
    sentenceA: '...',
    sentenceB: '...',
    correct: 'A', // or 'B'
    explanation: '...',
  },
  // ... 29 more
];

export function getWordsForGrade(grade) {
  return WORDS.filter(w => w.grade === grade);
}
```

---

## Word list — all 30 words (5 per grade)

| Grade | Words |
|-------|-------|
| 3 | actually, appear, brave, gentle, kind |
| 4 | significant, immediate, abundant, capable, essential |
| 5 | benefit, conflict, evident, authentic, elaborate |
| 6 | advocate, credible, ethical, eloquent, feasible |
| 7 | abstract, arbitrary, coherent, dormant, ephemeral |
| 8 | ambiguous, apathy, audacious, austere, benevolent |

---

## Sentence authoring rules

For each word, write Sentence A and Sentence B so that:
- The vocabulary word appears naturally in **both** sentences
- One sentence uses the word correctly in meaning and register
- The incorrect sentence is **subtly wrong** — wrong connotation, wrong context, wrong register, plausible-but-off — not obviously nonsensical or grammatically broken
- The word must be **identical in form** in both sentences (same inflection)
- The one-line explanation states clearly **why the correct sentence is right**, not just that it is

---

## Tap targets

All interactive elements must be ≥ 44×44 px. Use `min-height: 44px; min-width: 44px` and `padding` to achieve this — do not rely on content size alone.

---

## Responsiveness

- Desktop: sentence cards side by side (CSS grid, two equal columns)
- Mobile (≤ 600 px): sentence cards stacked vertically
- Use CSS media queries, no JS breakpoint detection

---

## Build order

1. `src/data/wordlist.js` — all 30 words with sentence pairs, answers, explanations
2. `src/utils.jsx` — `highlightWord` helper
3. `src/App.jsx` — state machine with `useReducer`, screen routing
4. `src/components/HomeScreen.jsx`
5. `src/components/GameStage.jsx` — word display, instruction subtitle, sentence cards, hint system, feedback
6. `src/components/WordResultCard.jsx`
7. `src/components/SessionSummary.jsx`
8. `src/components/ConfettiBlast.jsx`
9. `src/index.css` — CSS variables, global resets, shared utility classes
10. Run `npm run build` and confirm zero errors

---

## What NOT to add

- No API calls of any kind
- No localStorage or sessionStorage (resets on refresh by design)
- No Redux, Zustand, or other state libraries
- No heavy animation libraries (no Framer Motion, GSAP, etc.)
- No drag-and-drop
- No TypeScript (plain JS + JSX)
- No backend, no auth, no database
- No rounds, no mode selection, no Quick Play / Full Session split
