export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
export type WordCategory =
  | 'nature'
  | 'emotions'
  | 'science'
  | 'arts'
  | 'technology'
  | 'society'
  | 'academic'
  | 'business'
  | 'everyday';

export interface Word {
  id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  partOfSpeech: PartOfSpeech;
  difficulty: Difficulty;
  category: WordCategory;
  synonyms: string[];
  antonyms?: string[];
  level: number;
}
