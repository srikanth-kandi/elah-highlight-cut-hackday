const samplePlan = [
  { id: 1, action: "trimStart", value: 10, status: "valid" },
  { id: 2, action: "keepRange", value: [15, 55], status: "valid" },
  { id: 3, action: "addCaption", value: "Key takeaway", status: "valid" },
];

export default function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <span className="badge">Elah Hack Day</span>
        <h1>Highlight Cut Studio</h1>
      </header>

      <section className="panel request-panel">
        <label htmlFor="request">Editing request</label>
        <textarea
          id="request"
          rows="4"
          defaultValue="Trim the intro, keep the key takeaways, and add a title card at the beginning."
        />
        <button>Generate edit plan</button>
      </section>

      <section className="panel grid-panel">
        <div>
          <h2>AI planned edits</h2>
          <ul className="plan-list">
            {samplePlan.map((item) => (
              <li key={item.id} className={`plan-item ${item.status}`}>
                <strong>{item.action}</strong>
                <span>{JSON.stringify(item.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Preview</h2>
          <div className="video-preview">
            <div className="preview-overlay">
              <span>00:00</span>
              <span>00:45</span>
            </div>
            <div className="timeline-bar">
              <div className="clip clip-a" />
              <div className="clip clip-b" />
              <div className="clip clip-c" />
            </div>
          </div>
          <div className="actions">
            <button className="secondary">Discard</button>
            <button>Keep edit</button>
            <button className="secondary">Undo all</button>
          </div>
        </div>
      </section>
    </main>
  );
}
