import { useContext } from 'react';
import { GameContext } from './GameContext';

export function useGame() {
  return useContext(GameContext);
}
