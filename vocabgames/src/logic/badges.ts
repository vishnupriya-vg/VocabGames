import type { PlayerProfile, SessionResult } from '../types';

export function checkBadgeUnlocks(profile: PlayerProfile, session: SessionResult): string[] {
  const earned = new Set(profile.earnedBadges.map(b => b.badgeId));
  const newBadges: string[] = [];

  const add = (id: string) => {
    if (!earned.has(id)) {
      earned.add(id);
      newBadges.push(id);
    }
  };

  // First correct answer ever
  if (profile.learnedWordIds.length >= 1) add('first_word');

  // Streak milestones
  if (profile.currentStreak >= 3) add('streak_3');
  if (profile.currentStreak >= 7) add('streak_7');
  if (profile.currentStreak >= 30) add('streak_30');

  // Level unlocks
  if (profile.unlockedLevels.includes(5)) add('level_5');
  if (profile.unlockedLevels.includes(10)) add('level_10');

  // Session-specific
  if (session.totalQuestions >= 10 && session.mode === 'quiz') add('quiz_10');
  if (session.correctAnswers === session.totalQuestions && session.totalQuestions >= 10) add('perfect_10');
  if (session.speedBonuses >= 5) add('speed_demon');

  // Word count milestones
  if (profile.learnedWordIds.length >= 100) add('words_100');
  if (profile.learnedWordIds.length >= 500) add('words_500');

  // Night owl (11pm – 3am)
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 3) add('night_owl');

  return newBadges;
}
