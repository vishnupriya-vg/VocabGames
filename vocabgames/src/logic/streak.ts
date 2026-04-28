import type { PlayerProfile } from '../types';

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

export function updateStreak(profile: PlayerProfile): PlayerProfile {
  const today = toDateString(new Date());
  const last = profile.lastSessionDate;

  if (last === today) {
    // Already played today — no change
    return profile;
  }

  let newStreak: number;
  if (!last) {
    newStreak = 1;
  } else {
    const diff = daysBetween(last, today);
    if (diff === 1) {
      newStreak = profile.currentStreak + 1;
    } else {
      newStreak = 1; // Streak broken
    }
  }

  return {
    ...profile,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, profile.longestStreak),
    lastSessionDate: today,
  };
}

export function isStreakAlive(lastSessionDate: string): boolean {
  if (!lastSessionDate) return false;
  const today = toDateString(new Date());
  const diff = daysBetween(lastSessionDate, today);
  return diff <= 1;
}
