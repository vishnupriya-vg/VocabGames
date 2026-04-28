# Word Game 2 — Parcel Post: Word Sorting Game

## Git & GitHub
- **Repository:** https://github.com/vishnupriya-vg/Word-Game-2
- Branch: `main`
- Always commit with clean, descriptive messages and push to GitHub after every change.

---

## Game Overview
A vocabulary sorting game for grades 3–10. Each round a target word is revealed and 6 parcels arrive on a conveyor belt — 2 synonyms, 2 antonyms, and 2 "neither" words. Players sort each parcel into the correct basket. Three rounds per session (one target word per round). Warm, pleasant postal theme.

**Target audience:** Students, grades 3–10
**Learning goal:** Synonym/antonym recognition, understanding word relationships, vocabulary in context

---

## Files
| File | Purpose |
|------|---------|
| `index.html` | Entire game — HTML, CSS, and JS all inline |
| `parcel-questions.js` | Question bank — 3 questions per grade (G3–G10) |

---

## Gameplay Flow
1. **Grade Select screen** — Stamp-styled grade buttons (G3–G10).
2. **Game screen** (3 rounds per session):
   - Header: grade badge | round indicator | score + Exit button
   - 60-second timer bar per round
   - Target board shows the round's target word
   - Conveyor belt delivers 6 parcels one at a time
   - Player clicks a basket to sort the current parcel:
     - **Synonym basket** (green) — words that mean the same as the target
     - **Antonym basket** (red) — words that mean the opposite
     - **Neither basket** (tan) — same part of speech but clearly unrelated in meaning
   - **Correct sort:** Parcel flies into basket with animation; 10 pts scored
   - **Wrong sort:** Parcel bounces back with red tint + shake; word requeued; 0 pts for that word
   - Basket seals when both its words are correctly placed (ascending arpeggio + glow animation)
   - Round ends when all 3 baskets are sealed or timer hits 0
3. **Scorecard screen** — Per-round word chips (✓ or strikethrough), score per round (max 60), total score (max 180)

---

## Question Format (`parcel-questions.js`)
```js
const PARCEL_Q = {
  3: [
    { target: 'HAPPY', syn: ['JOYFUL','GLAD'], ant: ['SAD','MISERABLE'], nei: ['CALM','CURIOUS'] },
    ...
  ],
  ...
}
```
- 3 questions per grade (G3–G10), 24 total
- `nei` (neither): same part of speech as target, adjacent domain, but unambiguously NOT a synonym or antonym
- **Content rule:** Neither words must not be interpretable as synonyms or antonyms in any common usage

---

## Graded Word List
| Grade | Target Words |
|-------|-------------|
| G3 | HAPPY, BIG, FAST |
| G4 | BRAVE, ANGRY, CLEAN |
| G5 | ABUNDANT, COURAGEOUS, CHEERFUL |
| G6 | INTELLIGENT, GENEROUS, CAUTIOUS |
| G7 | DILIGENT, FRUGAL, CANDID |
| G8 | EPHEMERAL, TENACIOUS, BENEVOLENT |
| G9 | LOQUACIOUS, INTREPID, MAGNANIMOUS |
| G10 | EQUIVOCAL, PERFIDIOUS, SANGUINE |

---

## Scoring
- **10 pts** per correct first-attempt sort
- **0 pts** for any word that required a retry
- Max 60 pts per round, max 180 pts per session

---

## Timer
- 60 seconds per round
- Fill bar animates green → orange → red as time runs out
- Round ends at 0 — only sealed baskets count toward score

---

## Parcel Flight Animation
Uses `getBoundingClientRect()` + `position:fixed` clone technique:
1. Parcel element's opacity set to 0; a fixed-position clone is created at its exact screen coordinates
2. Clone CSS-transitions to the target basket's screen coordinates
3. **Correct sort:** clone shrinks and fades into the basket
4. **Wrong sort:** clone travels 45% toward basket (momentum), bounces back with red tint, shakes, fades out

---

## Sound Effects (Web Audio API — no external files)
| Trigger | Sound |
|---------|-------|
| Wrong sort | Uh-oh buzz |
| Basket sealed | Ascending arpeggio [523, 659, 784, 1047 Hz] |

---

## Feedback Bar
Fixed-height div between the conveyor belt and baskets — no floating toast, no overlap.
- `setFeedback(msg, cls)` — writes message
- `clearFeedback()` — clears it when the next parcel appears

---

## Visual Design
| Element | Colour |
|---------|--------|
| Background | `linear-gradient(160deg, #fef9f0, #faeedd)` — warm cream |
| Header | `linear-gradient(135deg, #c84a18, #e06020)` — postal red |
| Synonym basket | `#f0faf0` / `#66bb6a` — green |
| Antonym basket | `#fff5f5` / `#ef9a9a` — soft red |
| Neither basket | `#faf7f2` / `#bcaaa4` — tan |
| Conveyor belt | Animated rolling dashes via `beltRoll` CSS keyframe |
