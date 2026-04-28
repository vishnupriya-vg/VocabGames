# VocabGames

## What This App Does
A vocabulary learning game where players progress through 10 levels by learning words through flashcards, quizzes, and fill-in-the-blank activities. Players earn XP, maintain streaks, and unlock badges as they build their vocabulary.

---

## App Details
| Field | Info |
|-------|------|
| Folder | `C:\Users\vishnu.priya\OneDrive\Desktop\AI Projects\VocabGames\vocabgames` |
| Type | React + TypeScript (Vite) |
| Deployed URL | https://vocabgames.surge.sh |
| Game Modes | Flashcard, Quiz, Word Match, Fill in the Blank, Type Answer |

---

## Word Bank
| Detail | Info |
|--------|------|
| Total Words | 600 (60 words per level) |
| Difficulty Levels | Beginner, Intermediate, Advanced |
| Parts of Speech | Adjective, Verb, Noun |
| Categories | Everyday, Emotions, Nature, Society, Science, Academic |
| Each word includes | Word, meaning, example sentence, part of speech, difficulty, category, synonyms, level |

---

## Levels (10 Total)
| Level | Name | XP Required | Icon |
|-------|------|-------------|------|
| 1 | Word Sprout | 0 | 🌱 |
| 2 | Word Scout | 200 | 🔍 |
| 3 | Word Builder | 500 | 🧱 |
| 4 | Word Explorer | 900 | 🗺️ |
| 5 | Word Seeker | 1,400 | ⚡ |
| 6 | Word Weaver | 2,100 | 🕸️ |
| 7 | Word Scholar | 3,000 | 📚 |
| 8 | Word Sage | 4,200 | 🦉 |
| 9 | Word Master | 5,800 | 👑 |
| 10 | Word Legend | 8,000 | 🏆 |

---

## Badges (12 Total)
| Badge | How to Earn |
|-------|-------------|
| 👣 First Steps | Answer your first word correctly |
| 🔥 On Fire | Maintain a 3-day streak |
| ⚔️ Week Warrior | Maintain a 7-day streak |
| 🗓️ Monthly Master | Maintain a 30-day streak |
| ⭐ Halfway There | Unlock level 5 |
| 🏆 Word Legend | Unlock all 10 levels |
| ⚡ Quick Thinker | Complete 10 quiz questions in one session |
| 💯 Perfect Session | Score 10/10 in one session |
| 💎 Century Club | Learn 100 unique words |
| 🎖️ Word Hoarder | Learn 500 unique words |
| 🚀 Speed Demon | Earn 5 speed bonuses in one session |
| 🦉 Night Owl | Complete a session between 11pm and 3am |

---

## Quiz Logic
- Each question shows 4 meaning options
- 3 distractors are picked from words of the same difficulty
- Options are shuffled randomly each time
- Progress and streaks are saved in browser localStorage
