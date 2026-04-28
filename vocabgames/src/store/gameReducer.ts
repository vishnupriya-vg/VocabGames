import type { GameState, PlayerProfile } from '../types';
import { DEFAULT_PROFILE } from '../persistence/localStorage';
import { LEVELS } from '../data/levels';
import { getLevelFromXP } from '../logic/xp';
import { updateStreak } from '../logic/streak';
import { checkBadgeUnlocks } from '../logic/badges';
import {
  NAVIGATE_TO, SELECT_LEVEL, SELECT_MODE, START_SESSION, END_SESSION,
  ANSWER_CORRECT, ANSWER_WRONG,
  LOAD_PROFILE, SET_PLAYER_NAME, COMPLETE_ONBOARDING, RESET_PROFILE,
  EARN_BADGE, UPDATE_STREAK,
  TOGGLE_SOUND, TOGGLE_TIMER, TOGGLE_THEME,
  SHOW_TOAST, HIDE_TOAST, SET_CONTENT_MODE,
} from './actions';

export const INITIAL_STATE: GameState = {
  screen: 'HOME',
  profile: { ...DEFAULT_PROFILE },
  selectedLevel: 1,
  selectedMode: 'word-match',
  sessionWordIds: [],
  currentQuestionIndex: 0,
  sessionCorrect: 0,
  sessionXP: 0,
  sessionSpeedBonuses: 0,
  consecutiveCorrect: 0,
  sessionResult: null,
  isOnboarded: false,
  toast: null,
  contentMode: 'general',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {

    case LOAD_PROFILE: {
      const profile: PlayerProfile = action.profile;
      const newLevel = getLevelFromXP(profile.totalXP);
      // Unlock any newly earned levels
      const unlockedLevels = [...new Set([...profile.unlockedLevels, ...LEVELS
        .filter(l => l.xpRequired <= profile.totalXP)
        .map(l => l.level)])];
      // Migrate old profiles that lack contentMode
      const migratedProfile = { ...profile, contentMode: profile.contentMode ?? 'general' as const };
      return {
        ...state,
        profile: { ...migratedProfile, currentLevel: newLevel, unlockedLevels },
        contentMode: migratedProfile.contentMode,
        isOnboarded: profile.playerName.length > 0,
      };
    }

    case SET_PLAYER_NAME:
      return { ...state, profile: { ...state.profile, playerName: action.name } };

    case COMPLETE_ONBOARDING:
      return {
        ...state,
        isOnboarded: true,
        profile: { ...state.profile, playerName: action.name },
      };

    case NAVIGATE_TO:
      return { ...state, screen: action.screen, toast: null };

    case SELECT_LEVEL:
      return { ...state, selectedLevel: action.level };

    case SELECT_MODE:
      return { ...state, selectedMode: action.mode };

    case START_SESSION: {
      const updatedProfile = updateStreak(state.profile);
      return {
        ...state,
        profile: updatedProfile,
        sessionWordIds: action.wordIds,
        currentQuestionIndex: 0,
        sessionCorrect: 0,
        sessionXP: 0,
        sessionSpeedBonuses: 0,
        consecutiveCorrect: 0,
        sessionResult: null,
      };
    }

    case ANSWER_CORRECT: {
      const { wordId, xp, speedBonus } = action;
      const profile = state.profile;
      const newTotalXP = profile.totalXP + xp;
      const newLevel = getLevelFromXP(newTotalXP);
      const leveledUp = newLevel > profile.currentLevel;

      // Update word history
      const prev = profile.wordHistory[wordId] || { attempts: 0, correct: 0, lastSeen: '' };
      const newCorrect = prev.correct + 1;
      const wordHistory = {
        ...profile.wordHistory,
        [wordId]: { attempts: prev.attempts + 1, correct: newCorrect, lastSeen: new Date().toISOString() },
      };

      // Track learned / mastered
      const learnedWordIds = profile.learnedWordIds.includes(wordId)
        ? profile.learnedWordIds
        : [...profile.learnedWordIds, wordId];
      const masteredWordIds = newCorrect >= 3 && !profile.masteredWordIds.includes(wordId)
        ? [...profile.masteredWordIds, wordId]
        : profile.masteredWordIds;

      // Unlock new levels
      const unlockedLevels = [...new Set([...profile.unlockedLevels, ...LEVELS
        .filter(l => l.xpRequired <= newTotalXP)
        .map(l => l.level)])];

      const updatedProfile: PlayerProfile = {
        ...profile,
        totalXP: newTotalXP,
        currentLevel: newLevel,
        unlockedLevels,
        wordHistory,
        learnedWordIds,
        masteredWordIds,
      };

      const newConsecutive = state.consecutiveCorrect + 1;
      const newSessionXP = state.sessionXP + xp;
      const newSessionSpeedBonuses = state.sessionSpeedBonuses + (speedBonus ? 1 : 0);

      // Check for session completion (10 questions)
      const newIndex = state.currentQuestionIndex + 1;
      const totalQuestions = state.sessionWordIds.length;
      const isSessionDone = newIndex >= totalQuestions;

      if (isSessionDone) {
        const newSessionCorrect = state.sessionCorrect + 1;
        // Check badge unlocks
        const sessionResult = {
          mode: state.selectedMode,
          level: state.selectedLevel,
          totalQuestions,
          correctAnswers: newSessionCorrect,
          xpEarned: newSessionXP,
          speedBonuses: newSessionSpeedBonuses,
          newBadges: [] as string[],
          leveledUp,
          newLevel,
        };
        const newBadges = checkBadgeUnlocks(updatedProfile, sessionResult);
        const profileWithBadges = newBadges.length > 0
          ? {
            ...updatedProfile,
            totalSessionsPlayed: updatedProfile.totalSessionsPlayed + 1,
            earnedBadges: [
              ...updatedProfile.earnedBadges,
              ...newBadges.map(id => ({ badgeId: id, earnedAt: new Date().toISOString() })),
            ],
          }
          : { ...updatedProfile, totalSessionsPlayed: updatedProfile.totalSessionsPlayed + 1 };

        return {
          ...state,
          profile: profileWithBadges,
          sessionCorrect: newSessionCorrect,
          sessionXP: newSessionXP,
          sessionSpeedBonuses: newSessionSpeedBonuses,
          consecutiveCorrect: newConsecutive,
          currentQuestionIndex: newIndex,
          sessionResult: { ...sessionResult, newBadges },
          screen: 'RESULTS',
        };
      }

      return {
        ...state,
        profile: updatedProfile,
        sessionCorrect: state.sessionCorrect + 1,
        sessionXP: newSessionXP,
        sessionSpeedBonuses: newSessionSpeedBonuses,
        consecutiveCorrect: newConsecutive,
        currentQuestionIndex: newIndex,
      };
    }

    case ANSWER_WRONG: {
      const { wordId } = action;
      const prev = state.profile.wordHistory[wordId] || { attempts: 0, correct: 0, lastSeen: '' };
      const wordHistory = {
        ...state.profile.wordHistory,
        [wordId]: { ...prev, attempts: prev.attempts + 1, lastSeen: new Date().toISOString() },
      };

      const newIndex = state.currentQuestionIndex + 1;
      const totalQuestions = state.sessionWordIds.length;
      const isSessionDone = newIndex >= totalQuestions;

      if (isSessionDone) {
        const sessionResult = {
          mode: state.selectedMode,
          level: state.selectedLevel,
          totalQuestions,
          correctAnswers: state.sessionCorrect,
          xpEarned: state.sessionXP,
          speedBonuses: state.sessionSpeedBonuses,
          newBadges: [] as string[],
          leveledUp: false,
          newLevel: state.profile.currentLevel,
        };
        const newBadges = checkBadgeUnlocks(state.profile, sessionResult);
        const profileFinal = newBadges.length > 0
          ? {
            ...state.profile,
            wordHistory,
            totalSessionsPlayed: state.profile.totalSessionsPlayed + 1,
            earnedBadges: [
              ...state.profile.earnedBadges,
              ...newBadges.map(id => ({ badgeId: id, earnedAt: new Date().toISOString() })),
            ],
          }
          : { ...state.profile, wordHistory, totalSessionsPlayed: state.profile.totalSessionsPlayed + 1 };
        return {
          ...state,
          profile: profileFinal,
          consecutiveCorrect: 0,
          currentQuestionIndex: newIndex,
          sessionResult: { ...sessionResult, newBadges },
          screen: 'RESULTS',
        };
      }

      return {
        ...state,
        profile: { ...state.profile, wordHistory },
        consecutiveCorrect: 0,
        currentQuestionIndex: newIndex,
      };
    }

    case END_SESSION:
      return { ...state, screen: 'RESULTS' };

    case EARN_BADGE: {
      const already = state.profile.earnedBadges.some(b => b.badgeId === action.badgeId);
      if (already) return state;
      return {
        ...state,
        profile: {
          ...state.profile,
          earnedBadges: [
            ...state.profile.earnedBadges,
            { badgeId: action.badgeId, earnedAt: new Date().toISOString() },
          ],
        },
      };
    }

    case UPDATE_STREAK:
      return { ...state, profile: updateStreak(state.profile) };

    case TOGGLE_SOUND:
      return {
        ...state,
        profile: {
          ...state.profile,
          settings: { ...state.profile.settings, soundEnabled: !state.profile.settings.soundEnabled },
        },
      };

    case TOGGLE_TIMER:
      return {
        ...state,
        profile: {
          ...state.profile,
          settings: { ...state.profile.settings, timerEnabled: !state.profile.settings.timerEnabled },
        },
      };

    case TOGGLE_THEME: {
      const newTheme = state.profile.settings.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      return {
        ...state,
        profile: {
          ...state.profile,
          settings: { ...state.profile.settings, theme: newTheme },
        },
      };
    }

    case RESET_PROFILE:
      document.documentElement.setAttribute('data-theme', 'dark');
      return { ...INITIAL_STATE, profile: { ...DEFAULT_PROFILE } };

    case SHOW_TOAST:
      return { ...state, toast: action.message };

    case HIDE_TOAST:
      return { ...state, toast: null };

    case SET_CONTENT_MODE:
      return {
        ...state,
        contentMode: action.mode,
        profile: { ...state.profile, contentMode: action.mode },
      };

    default:
      return state;
  }
}
