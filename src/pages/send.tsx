type SendProps = {
  onBack: () => void;
};

function Send({ onBack }: SendProps) {
  return (
    <div className="app-shell">
      <div className="content-panel">
        <button className="back-button" onClick={onBack}>
          ← back
        </button>
        <h1>send a pigeon</h1>
        <p>Compose your message and send it.</p>
      </div>
    </div>
  );
}

export default Send;
