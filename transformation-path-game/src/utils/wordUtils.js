import { isValidWord } from '../data/words';

export { isValidWord };

// Insert a letter at position idx (0 = before first letter)
export function addLetter(word, idx, letter) {
  return word.slice(0, idx) + letter + word.slice(idx);
}

// Remove the letter at position idx
export function removeLetter(word, idx) {
  return word.slice(0, idx) + word.slice(idx + 1);
}

// Replace the letter at position idx with a new letter
export function replaceLetter(word, idx, letter) {
  return word.slice(0, idx) + letter + word.slice(idx + 1);
}

// Get all valid words reachable from word via add
export function getValidAdds(word) {
  const results = [];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i <= word.length; i++) {
    for (const ch of alphabet) {
      const candidate = addLetter(word, i, ch);
      if (isValidWord(candidate)) {
        results.push({ word: candidate, op: 'add', pos: i, letter: ch });
      }
    }
  }
  return results;
}

// Get all valid words reachable from word via remove
export function getValidRemoves(word) {
  const results = [];
  for (let i = 0; i < word.length; i++) {
    const candidate = removeLetter(word, i);
    if (candidate.length > 0 && isValidWord(candidate)) {
      results.push({ word: candidate, op: 'remove', pos: i });
    }
  }
  return results;
}

// Get all valid words reachable from word via replace
export function getValidReplaces(word) {
  const results = [];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < word.length; i++) {
    for (const ch of alphabet) {
      if (ch === word[i]) continue;
      const candidate = replaceLetter(word, i, ch);
      if (isValidWord(candidate)) {
        results.push({ word: candidate, op: 'replace', pos: i, letter: ch });
      }
    }
  }
  return results;
}

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
