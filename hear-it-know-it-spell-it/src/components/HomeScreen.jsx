import './HomeScreen.css';

const GRADES = [3, 4, 5, 6, 7, 8];

export default function HomeScreen({ onGradeSelect }) {
  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Hear It · Know It · Spell It</h1>
        <p className="home-subtitle">A vocabulary game for curious minds</p>
      </header>

      <main className="home-main">
        <p className="grade-prompt">Choose your grade to begin</p>
        <div className="grade-grid">
          {GRADES.map(g => (
            <button key={g} className="grade-btn" onClick={() => onGradeSelect(g)}>
              <span className="grade-label">Grade</span>
              <span className="grade-num">{g}</span>
            </button>
          ))}
        </div>
        <p className="home-info">5 rounds · 5 words each · 25 words per grade</p>
      </main>
    </div>
  );
}
