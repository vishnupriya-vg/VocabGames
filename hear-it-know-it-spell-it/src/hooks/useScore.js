import { useMemo } from 'react';

// Max raw points per word: MCQ 100+50 + Spelling 150+50 = 350
const MAX_PER_WORD = 350;

export function useScore(results) {
  return useMemo(() => {
    let streak    = 0;
    let bestStreak = 0;
    let rawTotal  = 0;

    const wordRows = results.map(r => {
      if (!r) return null;

      const mcq   = r.mcq   ?? {};
      const spell = r.spelling ?? {};

      // Perfect: MCQ correct with no hints + spelling correct on 1st attempt with no hints
      const mcqPerfect   = mcq.correct   === true && (mcq.hintsUsed   ?? 1) === 0;
      const spellPerfect = spell.correct === true && (spell.attempts  ?? 1) === 0
                                                  && (spell.hintsUsed ?? 1) === 0;
      const isPerfect = mcqPerfect && spellPerfect;

      if (isPerfect) { streak++; if (streak > bestStreak) bestStreak = streak; }
      else           { streak = 0; }

      const wordPts = (mcq.points ?? 0) + (spell.points ?? 0);
      rawTotal += wordPts;

      // Outcome for summary table
      const mcqFailed   = !mcq.correct;
      const spellFailed = !spell.correct;
      const outcome = isPerfect              ? 'Perfect'
                    : mcqFailed && spellFailed ? 'Missed'
                    : 'Partial';

      return { wordObj: r.word, mcq, spell, wordPts, isPerfect, outcome };
    });

    const multiplier  = bestStreak >= 5 ? 1.5 : bestStreak >= 3 ? 1.2 : 1.0;
    const finalScore  = Math.round(rawTotal * multiplier);
    const maxPossible = results.length * MAX_PER_WORD; // 25 × 350 = 8 750

    // Stars use finalScore (multiplier can push you over thresholds — intended reward)
    const starPct = finalScore / maxPossible;
    const stars   = starPct >= 0.85 ? 3 : starPct >= 0.60 ? 2 : 1;

    return { wordRows, rawTotal, multiplier, finalScore, bestStreak, maxPossible, stars };
  }, [results]);
}
