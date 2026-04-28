import { useState } from 'react';
import styles from './HomeScreen.module.css';
import { useGame } from '../../store/useGame';
import { navigateTo, completeOnboarding, setContentMode } from '../../store/actions';
import { XPBar } from '../../components/XPBar/XPBar';
import { StreakBadge } from '../../components/StreakBadge/StreakBadge';
import { getXPToNextLevel } from '../../logic/xp';
import type { ContentMode } from '../../types';

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { profile, isOnboarded, contentMode } = state;
  const [nameInput, setNameInput] = useState('');
  const [onboardStep, setOnboardStep] = useState(0);

  const xpProgress = getXPToNextLevel(profile.totalXP);

  function handleContentMode(mode: ContentMode) {
    dispatch(setContentMode(mode));
  }

  // First-launch onboarding
  if (!isOnboarded) {
    const steps = [
      { title: 'Welcome to VocabGames!', desc: 'Build your vocabulary through fun flashcard games.', icon: '📚' },
      { title: 'Tap to flip', desc: 'Flip flashcards to reveal meanings, then rate yourself.', icon: '🃏' },
      { title: 'Earn XP & unlock levels', desc: 'Answer correctly to earn XP and unlock harder words.', icon: '⭐' },
    ];

    if (onboardStep < steps.length) {
      const step = steps[onboardStep];
      return (
        <div className={styles.onboard}>
          <div className={styles.onboardCard}>
            <span className={styles.onboardIcon}>{step.icon}</span>
            <h2>{step.title}</h2>
            <p>{step.desc}</p>
            <button className={styles.primaryBtn} onClick={() => setOnboardStep(s => s + 1)}>
              Next →
            </button>
          </div>
          <div className={styles.dots}>
            {steps.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i === onboardStep ? styles.dotActive : ''}`} />
            ))}
          </div>
        </div>
      );
    }

    // Name entry
    return (
      <div className={styles.onboard}>
        <div className={styles.onboardCard}>
          <span className={styles.onboardIcon}>✏️</span>
          <h2>What's your name?</h2>
          <p>We'll use it to personalise your experience.</p>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Enter your name…"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            maxLength={24}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter' && nameInput.trim()) {
                dispatch(completeOnboarding(nameInput.trim()));
              }
            }}
          />
          <button
            className={styles.primaryBtn}
            disabled={!nameInput.trim()}
            onClick={() => dispatch(completeOnboarding(nameInput.trim()))}
          >
            Let's play! 🎮
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`screen ${styles.home}`}>
      {/* Header */}
      <div className={styles.header}>
        <StreakBadge streak={profile.currentStreak} />
        <div className={styles.xpSection}>
          <XPBar
            currentXP={xpProgress.current}
            requiredXP={xpProgress.required}
            level={profile.currentLevel}
          />
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.logoMark}>📖</div>
        <h1 className={styles.appName}>VocabGames</h1>
        <p className={styles.greeting}>
          {profile.playerName ? `Welcome back, ${profile.playerName}!` : 'Ready to learn?'}
        </p>
        <p className={styles.stats}>
          <span>{profile.learnedWordIds.length} words learned</span>
          <span className={styles.dot}>·</span>
          <span>Level {profile.currentLevel}</span>
        </p>
      </div>

      {/* Learning Mode Selector */}
      <div className={styles.modeSection}>
        <p className={styles.modeLabel}>Learning Mode</p>
        <div className={styles.modePicker}>
          <button
            className={`${styles.modeBtn} ${contentMode === 'general' ? styles.modeBtnActive : ''}`}
            onClick={() => handleContentMode('general')}
          >
            <span className={styles.modeBtnIcon}>📚</span>
            <span className={styles.modeBtnTitle}>General</span>
            <span className={styles.modeBtnDesc}>Everyday English</span>
          </button>
          <button
            className={`${styles.modeBtn} ${contentMode === 'test-prep' ? styles.modeBtnActive : ''}`}
            onClick={() => handleContentMode('test-prep')}
          >
            <span className={styles.modeBtnIcon}>🎓</span>
            <span className={styles.modeBtnTitle}>Test Prep</span>
            <span className={styles.modeBtnDesc}>GRE &amp; SAT words</span>
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <button
          className={styles.playBtn}
          onClick={() => dispatch(navigateTo('LEVEL_MAP'))}
        >
          PLAY NOW ⚡
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={() => dispatch(navigateTo('LEVEL_MAP'))}
        >
          Choose Level
        </button>
      </div>
    </div>
  );
}
