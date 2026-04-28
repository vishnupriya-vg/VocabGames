import type { Difficulty } from '../types';
import { LEVELS } from '../data/levels';

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
  expert: 3.0,
};

const BASE_XP = 10;
const SPEED_BONUS = 5;

export function calculateXP(
  difficulty: Difficulty,
  streak: number,
  speedBonus: boolean,
): number {
  const diffMult = DIFFICULTY_MULTIPLIER[difficulty];
  const streakBonus = 1 + Math.min(streak * 0.05, 0.5);
  const base = Math.round(BASE_XP * diffMult * streakBonus);
  return base + (speedBonus ? SPEED_BONUS : 0);
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  for (const l of LEVELS) {
    if (totalXP >= l.xpRequired) level = l.level;
    else break;
  }
  return level;
}

export function getXPToNextLevel(totalXP: number): { current: number; required: number; level: number } {
  const currentLevel = getLevelFromXP(totalXP);
  const nextLevelConfig = LEVELS.find(l => l.level === currentLevel + 1);
  if (!nextLevelConfig) {
    // Max level
    const thisLevel = LEVELS.find(l => l.level === currentLevel)!;
    return { current: totalXP - thisLevel.xpRequired, required: 0, level: currentLevel };
  }
  const thisLevel = LEVELS.find(l => l.level === currentLevel)!;
  return {
    current: totalXP - thisLevel.xpRequired,
    required: nextLevelConfig.xpRequired - thisLevel.xpRequired,
    level: currentLevel,
  };
}
