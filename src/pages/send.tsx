import { useState } from "react";
import { useSelector } from "react-redux";
import planeImage from "../assets/plane.jpg";
import type { RootState } from "../store/store";

type SendProps = {
  onBack: () => void;
};

// const res = await fetch(import.meta.env.VITE_AUTH_URL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             init_data: initData,
//             t_user_name: window.Telegram?.WebApp.initDataUnsafe.user?.username,
//             t_id: window.Telegram?.WebApp.initDataUnsafe.user?.id,
//           }),
//       });

function sendPigeon(isAuthenticated: Boolean, selectedPigeon: number) {
  console.log("Send tapped, isAuthenticated:", isAuthenticated == true)
  console.log("selectedPigeon:", selectedPigeon)
}

function Send({ onBack }: SendProps) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [selectedPigeon, setSelectedPigeon] = useState<number | null>(null);
  const [toRandom, setToRandom] = useState(false);

  const pigeons = Object.values(
  import.meta.glob<string>(
    "../assets/pigeons/*.{png,jpg,jpeg,webp}",
    { eager: true, query: "?url", import: "default" }
  )
);

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
          {Array.from({ length: pigeons.length }, (_, index) => (
            <button
              className={`pigeon-option${selectedPigeon === index ? " selected" : ""}`}
              type="button"
              key={index}
              aria-label={`Choose pigeon ${index + 1}`}
              aria-pressed={selectedPigeon === index}
              onClick={() => setSelectedPigeon(index)}
            >
              <img src={pigeons[index]} alt="" />
            </button>
          ))}
        </section>

        <form className="message-form">
          <label className="message-field-user">
            <span>From</span>
            <span className="message-field-user-name">{userName ?? "Unknown"}</span>
          </label>

          <div className="recipient-row">
            <label className="message-field-user recipient-field">
              <span>To</span>
              <input
                type="text"
                name="recipient"
                placeholder="Recipient"
                disabled={toRandom}
              />
            </label>

            <label className="random-recipient-toggle">
              <input
                type="checkbox"
                name="toRandom"
                checked={toRandom}
                onChange={(event) => setToRandom(event.target.checked)}
              />
              <span className="toggle-control" aria-hidden="true" />
              <span>To random</span>
            </label>
          </div>

          <label className="message-field">
            <span>Message</span>
            <textarea name="message" rows={7} placeholder="Write your message..." />
          </label>

        </form>
      </div>
      <button 
        className="send-button" 
        type="button" 
        aria-label="Send message"
        onClick={() => sendPigeon(isAuthenticated, selectedPigeon)}
      >
        <img src={planeImage} alt="" />
      </button>
    </div>
  );
}

export default Send;
