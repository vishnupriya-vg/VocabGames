export type Screen =
  | 'HOME'
  | 'LEVEL_MAP'
  | 'MODE_SELECT'
  | 'WORD_MATCH'
  | 'QUIZ'
  | 'FILL_BLANK'
  | 'RESULTS'
  | 'PROFILE';

export type GameMode = 'word-match' | 'quiz' | 'fill-blank';
export type ContentMode = 'general' | 'test-prep';
export type Theme = 'dark' | 'light';

export interface LevelConfig {
  level: number;
  name: string;
  xpRequired: number;
  wordCount: number;
  color: string;
  icon: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export interface WordHistory {
  attempts: number;
  correct: number;
  lastSeen: string;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  timerEnabled: boolean;
  preferredMode: GameMode;
  theme: Theme;
}

export interface PlayerProfile {
  playerName: string;
  createdAt: string;
  totalXP: number;
  currentLevel: number;
  unlockedLevels: number[];
  lastSessionDate: string;
  currentStreak: number;
  longestStreak: number;
  totalSessionsPlayed: number;
  learnedWordIds: string[];
  masteredWordIds: string[];
  wordHistory: Record<string, WordHistory>;
  earnedBadges: EarnedBadge[];
  settings: PlayerSettings;
  contentMode: ContentMode;
}

export interface SessionResult {
  mode: GameMode;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  speedBonuses: number;
  newBadges: string[];
  leveledUp: boolean;
  newLevel: number;
}

export interface GameState {
  screen: Screen;
  profile: PlayerProfile;
  selectedLevel: number;
  selectedMode: GameMode;
  sessionWordIds: string[];
  currentQuestionIndex: number;
  sessionCorrect: number;
  sessionXP: number;
  sessionSpeedBonuses: number;
  consecutiveCorrect: number;
  sessionResult: SessionResult | null;
  isOnboarded: boolean;
  toast: string | null;
  contentMode: ContentMode;
}
