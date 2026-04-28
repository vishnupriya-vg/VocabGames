import type { BadgeDefinition } from '../types';

export const BADGES: BadgeDefinition[] = [
  { id: 'first_word',  name: 'First Steps',      description: 'Answer your first word correctly',          icon: '👣' },
  { id: 'streak_3',    name: 'On Fire',           description: 'Maintain a 3-day streak',                   icon: '🔥' },
  { id: 'streak_7',    name: 'Week Warrior',      description: 'Maintain a 7-day streak',                   icon: '⚔️' },
  { id: 'streak_30',   name: 'Monthly Master',    description: 'Maintain a 30-day streak',                  icon: '🗓️' },
  { id: 'level_5',     name: 'Halfway There',     description: 'Unlock level 5',                            icon: '⭐' },
  { id: 'level_10',    name: 'Word Legend',       description: 'Unlock all 10 levels',                      icon: '🏆' },
  { id: 'quiz_10',     name: 'Quick Thinker',     description: 'Complete 10 quiz questions in one session', icon: '⚡' },
  { id: 'perfect_10',  name: 'Perfect Session',   description: 'Score 10/10 in one session',                icon: '💯' },
  { id: 'words_100',   name: 'Century Club',      description: 'Learn 100 unique words',                    icon: '💎' },
  { id: 'words_500',   name: 'Word Hoarder',      description: 'Learn 500 unique words',                    icon: '🎖️' },
  { id: 'speed_demon', name: 'Speed Demon',       description: 'Earn 5 speed bonuses in one session',       icon: '🚀' },
  { id: 'night_owl',   name: 'Night Owl',         description: 'Complete a session between 11pm and 3am',   icon: '🦉' },
];
