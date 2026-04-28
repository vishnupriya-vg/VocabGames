import type { PlayerProfile } from '../types';

const STORAGE_KEY = 'vocabgames_profile';

export const DEFAULT_PROFILE: PlayerProfile = {
  playerName: '',
  createdAt: new Date().toISOString(),
  totalXP: 0,
  currentLevel: 1,
  unlockedLevels: [1],
  lastSessionDate: '',
  currentStreak: 0,
  longestStreak: 0,
  totalSessionsPlayed: 0,
  learnedWordIds: [],
  masteredWordIds: [],
  wordHistory: {},
  earnedBadges: [],
  settings: {
    soundEnabled: true,
    timerEnabled: false,
    preferredMode: 'word-match',
    theme: 'dark',
  },
  contentMode: 'general',
};

export function loadProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage might be unavailable (private mode, storage full)
  }
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}
