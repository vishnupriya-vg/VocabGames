import type { GameMode, Screen, ContentMode } from '../types';

// Navigation
export const NAVIGATE_TO = 'NAVIGATE_TO';
export const SELECT_LEVEL = 'SELECT_LEVEL';
export const SELECT_MODE = 'SELECT_MODE';

// Session lifecycle
export const START_SESSION = 'START_SESSION';
export const END_SESSION = 'END_SESSION';

// Gameplay
export const ANSWER_CORRECT = 'ANSWER_CORRECT';
export const ANSWER_WRONG = 'ANSWER_WRONG';
export const NEXT_QUESTION = 'NEXT_QUESTION';

// Profile management
export const LOAD_PROFILE = 'LOAD_PROFILE';
export const SET_PLAYER_NAME = 'SET_PLAYER_NAME';
export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';
export const RESET_PROFILE = 'RESET_PROFILE';

// Badges
export const EARN_BADGE = 'EARN_BADGE';

// Streak
export const UPDATE_STREAK = 'UPDATE_STREAK';

// Settings
export const TOGGLE_SOUND = 'TOGGLE_SOUND';
export const TOGGLE_TIMER = 'TOGGLE_TIMER';
export const TOGGLE_THEME = 'TOGGLE_THEME';

// Content mode
export const SET_CONTENT_MODE = 'SET_CONTENT_MODE';

// Toast
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

// Action creators
export const navigateTo = (screen: Screen) => ({ type: NAVIGATE_TO as typeof NAVIGATE_TO, screen });
export const selectLevel = (level: number) => ({ type: SELECT_LEVEL as typeof SELECT_LEVEL, level });
export const selectMode = (mode: GameMode) => ({ type: SELECT_MODE as typeof SELECT_MODE, mode });
export const startSession = (wordIds: string[]) => ({ type: START_SESSION as typeof START_SESSION, wordIds });
export const answerCorrect = (wordId: string, xp: number, speedBonus: boolean) => ({
  type: ANSWER_CORRECT as typeof ANSWER_CORRECT, wordId, xp, speedBonus,
});
export const answerWrong = (wordId: string) => ({ type: ANSWER_WRONG as typeof ANSWER_WRONG, wordId });
export const showToast = (message: string) => ({ type: SHOW_TOAST as typeof SHOW_TOAST, message });
export const hideToast = () => ({ type: HIDE_TOAST as typeof HIDE_TOAST });
export const toggleTheme = () => ({ type: TOGGLE_THEME as typeof TOGGLE_THEME });
export const toggleSound = () => ({ type: TOGGLE_SOUND as typeof TOGGLE_SOUND });
export const toggleTimer = () => ({ type: TOGGLE_TIMER as typeof TOGGLE_TIMER });
export const resetProfile = () => ({ type: RESET_PROFILE as typeof RESET_PROFILE });
export const setPlayerName = (name: string) => ({ type: SET_PLAYER_NAME as typeof SET_PLAYER_NAME, name });
export const completeOnboarding = (name: string) => ({ type: COMPLETE_ONBOARDING as typeof COMPLETE_ONBOARDING, name });
export const setContentMode = (mode: ContentMode) => ({ type: SET_CONTENT_MODE as typeof SET_CONTENT_MODE, mode });
