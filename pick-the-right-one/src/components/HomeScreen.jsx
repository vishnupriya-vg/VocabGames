export default function HomeScreen({ onSelectGrade }) {
  return (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="home-title">Pick the Right One</h1>
        <p className="home-sub">Which sentence uses the word correctly?</p>
        <div className="grade-grid">
          {[3, 4, 5, 6, 7, 8].map((g) => (
            <button key={g} className="grade-btn" onClick={() => onSelectGrade(g)}>
              Grade {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
