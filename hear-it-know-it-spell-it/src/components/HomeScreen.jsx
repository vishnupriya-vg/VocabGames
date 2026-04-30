import { useState } from 'react';
import './HomeScreen.css';

const GRADES = [3, 4, 5, 6, 7, 8];

export default function HomeScreen({ onGradeSelect }) {
  const [selectedGrade, setSelectedGrade] = useState(null);

  function handleGrade(g) {
    setSelectedGrade(g);
  }

  function handleMode(mode) {
    onGradeSelect(selectedGrade, mode);
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Hear It · Know It · Spell It</h1>
        <p className="home-subtitle">A vocabulary game for curious minds</p>
      </header>

      {!selectedGrade ? (
        <main className="home-main">
          <p className="grade-prompt">Choose your grade to begin</p>
          <div className="grade-grid">
            {GRADES.map(g => (
              <button key={g} className="grade-btn" onClick={() => handleGrade(g)}>
                <span className="grade-label">Grade</span>
                <span className="grade-num">{g}</span>
              </button>
            ))}
          </div>
          <p className="home-info">5 rounds · 5 words each · 25 words per grade</p>
        </main>
      ) : (
        <main className="home-main">
          <p className="grade-prompt">Grade {selectedGrade} — Choose your mode</p>
          <div className="mode-grid">
            <button className="mode-btn" onClick={() => handleMode('quick')}>
              <span className="mode-icon">⚡</span>
              <span className="mode-name">Quick Play</span>
              <span className="mode-desc">2 rounds · 10 words</span>
            </button>
            <button className="mode-btn mode-btn-full" onClick={() => handleMode('full')}>
              <span className="mode-icon">🎓</span>
              <span className="mode-name">Full Session</span>
              <span className="mode-desc">5 rounds · 25 words</span>
            </button>
          </div>
          <button className="mode-back-btn" onClick={() => setSelectedGrade(null)}>
            ← Back to Grades
          </button>
        </main>
      )}
    </div>
  );
}
