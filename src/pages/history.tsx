type HistoryProps = {
  onBack: () => void;
};

function History({ onBack }: HistoryProps) {
  return (
    <div className="app-shell">
      <div className="content-panel">
        <button className="back-button" onClick={onBack}>
          ← back
        </button>
        <h1>history</h1>
        <p>Your previous pigeons will appear here.</p>
      </div>
    </div>
  );
}

export default History;
