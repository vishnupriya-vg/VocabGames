# Word Game 1 — Bomb Tap: Odd One Out

## Git & GitHub
- **Repository:** https://github.com/vishnupriya-vg/Word-Game-1
- **GitHub Pages (live):** https://vishnupriya-vg.github.io/Word-Game-1/
- Branch: `master`
- Always commit with clean, descriptive messages and push to GitHub after every change.

---

## Game Overview
A timed vocabulary game for grades 3–10 where players identify the word that does NOT belong in a group. Three words share a relationship (synonyms or same category); the odd one out is an antonym or unrelated word. A bomb countdown adds urgency — defuse it by finding the right answer before time runs out.

**Target audience:** Students, grades 3–10
**Learning goal:** Synonym/antonym recognition, vocabulary in context

---

## Files
| File | Purpose |
|------|---------|
| `index.html` | Entire game — HTML, CSS, and JS all inline |
| `questions.js` | Question bank — 160 questions, 20 per grade (G3–G10) |

---

## Gameplay
1. Player selects a grade (G3–G10) on the start screen.
2. Four words appear on screen; player taps the odd one out.
3. **Correct answer:** Bomb diffuses → celebration sound → score +1 → next question.
4. **Wrong answer:** Bomb explodes → blast sound → game over screen with score.
5. Timer counts down per question; speed scales with grade (harder grades = less time).

---

## Question Format (`questions.js`)
```js
{
  words: ['SYN1', 'SYN2', 'SYN3', 'ANTONYM'],
  odd: 3,                        // zero-based index of the odd-one-out word
  category: 'Describing feelings',
  explanation: 'ANTONYM means the opposite, while the others mean ...'
}
```
- 160 questions total (20 per grade, G3–G10)
- Words are shuffled on display so the odd word's position varies each play
- Content rule: the three non-odd words must be clear synonyms or share an obvious category; the odd word must be unambiguously different

---

## Timer
```js
ROUND_TIME = Math.max(10, 30 - (grade - 3) * 3.33)
// G3 → ~30s,  G6 → ~20s,  G10 → ~10s
```

---

## Sound Effects (Web Audio API — no external files)
| Function | Trigger | Description |
|----------|---------|-------------|
| `playTick(urgent)` | Each second of countdown | Ticking; faster and higher pitch when urgent |
| `playBlast()` | Wrong answer | Explosion sound |
| `playCelebration()` | Correct answer | Ascending arpeggio |

---

## Alarm Lights
- Two `.alarm-light` divs flank the bomb emoji in the UI.
- `setAlarm(true)` adds `.active` class → lights blink red.
- Alarm activates when ≤ 5 seconds remain on the timer.

---

## Visual Design
- Dark bomb-defuse aesthetic — dark background, glowing bomb emoji centrepiece
- Alarm lights blink red in the final 5 seconds
- Green flash on correct answer, red flash on wrong answer
- Grade select screen with themed stamp-style buttons

---

## Scoring
- +1 point per correct answer
- Score resets on game over (wrong answer ends the session)
- High score not persisted between sessions (no local storage)
