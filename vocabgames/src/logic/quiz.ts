import type { Word } from '../types';
import { WORDS } from '../data/words';
import { shuffle } from './flashcard';

export interface QuizQuestion {
  word: Word;
  options: string[];      // 4 meanings
  correctIndex: number;
}

export function generateQuizQuestion(targetWord: Word): QuizQuestion {
  // Get distractors from same difficulty, exclude the target
  const sameDifficulty = WORDS.filter(
    w => w.difficulty === targetWord.difficulty && w.id !== targetWord.id,
  );

  // Shuffle and pick 3 distractors whose meanings don't overlap synonyms
  const shuffled = shuffle(sameDifficulty);
  const distractors: string[] = [];
  for (const w of shuffled) {
    if (distractors.length >= 3) break;
    distractors.push(w.meaning);
  }

  // If not enough, pad with words from adjacent difficulty
  if (distractors.length < 3) {
    const others = WORDS.filter(w => w.id !== targetWord.id && !sameDifficulty.includes(w));
    const moreDistractors = shuffle(others).slice(0, 3 - distractors.length).map(w => w.meaning);
    distractors.push(...moreDistractors);
  }

  const allOptions = shuffle([targetWord.meaning, ...distractors.slice(0, 3)]);
  const correctIndex = allOptions.indexOf(targetWord.meaning);

  return { word: targetWord, options: allOptions, correctIndex };
}
