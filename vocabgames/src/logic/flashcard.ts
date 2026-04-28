import type { Word, ContentMode } from '../types';
import { WORDS } from '../data/words';

export function getWordsForLevel(level: number): Word[] {
  return WORDS.filter(w => w.level === level);
}

export function getWordsForSession(level: number, seenWordIds: string[], count = 10): Word[] {
  const levelWords = getWordsForLevel(level);

  // Prefer unseen words first
  const unseen = levelWords.filter(w => !seenWordIds.includes(w.id));
  const seen = levelWords.filter(w => seenWordIds.includes(w.id));

  const pool = [...shuffle(unseen), ...shuffle(seen)];
  return pool.slice(0, Math.min(count, pool.length));
}

export function getWordsForTestPrep(seenWordIds: string[], count = 10): Word[] {
  const pool = WORDS.filter(w => w.difficulty === 'advanced' || w.difficulty === 'expert');
  const unseen = pool.filter(w => !seenWordIds.includes(w.id));
  const seen = pool.filter(w => seenWordIds.includes(w.id));
  return [...shuffle(unseen), ...shuffle(seen)].slice(0, count);
}

export function getSessionWords(
  level: number,
  seenWordIds: string[],
  contentMode: ContentMode,
  count = 10,
): Word[] {
  if (contentMode === 'test-prep') {
    return getWordsForTestPrep(seenWordIds, count);
  }
  return getWordsForSession(level, seenWordIds, count);
}

export function getDistractors(exclude: Word, pool: Word[], count: number): Word[] {
  const lowerSynonyms = (exclude.synonyms ?? []).map(s => s.toLowerCase());
  const lowerAntonyms = (exclude.antonyms ?? []).map(a => a.toLowerCase());
  const filtered = pool.filter(
    w => w.id !== exclude.id &&
      !lowerSynonyms.includes(w.word.toLowerCase()) &&
      !lowerAntonyms.includes(w.word.toLowerCase()),
  );
  return shuffle(filtered).slice(0, count);
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
