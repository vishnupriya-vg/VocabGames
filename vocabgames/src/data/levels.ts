import type { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  { level: 1,  name: 'Word Sprout',   xpRequired: 0,     wordCount: 60, color: '#43D18A', icon: '🌱' },
  { level: 2,  name: 'Word Scout',    xpRequired: 200,   wordCount: 60, color: '#4FC3F7', icon: '🔍' },
  { level: 3,  name: 'Word Builder',  xpRequired: 500,   wordCount: 60, color: '#81C784', icon: '🧱' },
  { level: 4,  name: 'Word Explorer', xpRequired: 900,   wordCount: 60, color: '#FFB74D', icon: '🗺️' },
  { level: 5,  name: 'Word Seeker',   xpRequired: 1400,  wordCount: 60, color: '#FF8A65', icon: '⚡' },
  { level: 6,  name: 'Word Weaver',   xpRequired: 2100,  wordCount: 60, color: '#BA68C8', icon: '🕸️' },
  { level: 7,  name: 'Word Scholar',  xpRequired: 3000,  wordCount: 60, color: '#7986CB', icon: '📚' },
  { level: 8,  name: 'Word Sage',     xpRequired: 4200,  wordCount: 60, color: '#4DD0E1', icon: '🦉' },
  { level: 9,  name: 'Word Master',   xpRequired: 5800,  wordCount: 60, color: '#F06292', icon: '👑' },
  { level: 10, name: 'Word Legend',   xpRequired: 8000,  wordCount: 60, color: '#FFD700', icon: '🏆' },
];
