import { useState } from "react";
import { useSelector } from "react-redux";
import planeImage from "../assets/plane.jpg";
import reactLogo from "../assets/react.svg";
import type { RootState } from "../store/store";

type SendProps = {
  onBack: () => void;
};

function Send({ onBack }: SendProps) {
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [selectedPigeon, setSelectedPigeon] = useState<number | null>(null);

  return (
    <div className="app-shell">
      <div className="content-panel send-panel">
        <header className="send-header">
          <button
            className="back-button"
            type="button"
            aria-label="Go back"
            onClick={onBack}
          >
            ←
          </button>
          <h1>send a pigeon</h1>
        </header>

        <section className="pigeon-picker" aria-label="Choose a pigeon">
          {Array.from({ length: 4 }, (_, index) => (
            <button
              className={`pigeon-option${selectedPigeon === index ? " selected" : ""}`}
              type="button"
              key={index}
              aria-label={`Choose pigeon ${index + 1}`}
              aria-pressed={selectedPigeon === index}
              onClick={() => setSelectedPigeon(index)}
            >
              <img src={reactLogo} alt="" />
            </button>
          ))}
        </section>

        <form className="message-form">
          <label className="message-field-user">
            <span>From</span>
            <input type="text" value={userName ?? "Unknown"} readOnly />
          </label>

          <label className="message-field-user">
            <span>To</span>
            <input type="text" name="recipient" placeholder="Recipient" />
          </label>

          <label className="message-field">
            <span>Message</span>
            <textarea name="message" rows={7} placeholder="Write your message..." />
          </label>
        </form>
      </div>
      <button className="send-button" type="button" aria-label="Send message">
        <img src={planeImage} alt="" />
      </button>
    </div>
  );
}

export default Send;
