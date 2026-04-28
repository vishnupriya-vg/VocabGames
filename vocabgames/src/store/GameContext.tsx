import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import type { GameState } from '../types';
import { gameReducer, INITIAL_STATE } from './gameReducer';
import { loadProfile, saveProfile } from '../persistence/localStorage';
import { LOAD_PROFILE } from './actions';

interface GameContextValue {
  state: GameState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
}

export const GameContext = createContext<GameContextValue>({
  state: INITIAL_STATE,
  dispatch: () => undefined,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Load profile on mount
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      dispatch({ type: LOAD_PROFILE, profile: saved });
      document.documentElement.setAttribute('data-theme', saved.settings?.theme ?? 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Debounced save whenever profile changes
  const saveRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const save = useCallback(() => {
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      saveProfile(state.profile);
    }, 500);
  }, [state.profile]);

  useEffect(() => {
    if (state.profile.createdAt) {
      save();
    }
  }, [state.profile, save]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
