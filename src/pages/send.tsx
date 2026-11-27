import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import planeImage from "../assets/plane.jpg";
import type { RootState } from "../store/store";
import { RecepientField, RecepientStatus } from "./RecepientField";

type SendProps = {
  onBack: () => void;
};

function sendPigeon(isAuthenticated: Boolean, selectedPigeon: number | null, recepient: String, message: String) {
  console.log("Send tapped, isAuthenticated:", isAuthenticated == true)
  console.log("selectedPigeon:", selectedPigeon)
  console.log("recepient:", recepient)
  console.log("message:", message)
}

type SendStatus = "ready" | "loading" | "sent_ok";

function Send({ onBack }: SendProps) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [selectedPigeon, setSelectedPigeon] = useState<number | null>(null);
  const [pageStatus, setPageStatus] = useState<SendStatus>("ready");
  const [sendError, setSendError] = useState<string | null>(null);
  const [recipientStatus, setReccipientStatus] = useState<RecepientStatus>('checked_ok');
  const [recipientName, setRecipientName] = useState<string>("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const sendPigeon = async () => {
    setSendError(null);
    console.log("start sending", recipientName, recipientStatus)

    const telegramUser = window.Telegram?.WebApp.initDataUnsafe.user;
    if (!isAuthenticated || !telegramUser) {
      setSendError("Please authenticate before sending.");
      return;
    }
    console.log("!!!! isAuthenticated")
    if (selectedPigeon === null) {
      setSendError("Choose a pigeon first.");
      return;
    }
    console.log("!!!! selectedPigeon - ok")
    console.log("reccipientStatus", recipientStatus)
    if (recipientStatus != 'checked_ok') {
      setSendError("Enter a correct recipient or turn on To random.");
      return;
    }
    console.log("!!!! reccipientStatus - ok")
    setPageStatus("loading");
    try {
      console.log("!!!! start networkong, rec name:", recipientName)
      const response = await fetch(
        new URL("/messages", import.meta.env.VITE_AUTH_URL),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender_id:  window.Telegram?.WebApp.initDataUnsafe.user?.id,
            recipient_name: recipientName,
            pigeon_id: 1, //selectedPigeon, hardcoded for now
            text: messageRef.current?.value.trim() ?? "",
          }),
        },
      );
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Request failed (${response.status})`);
      }

      console.log("Pigeon sent:", responseText);
      setPageStatus("sent_ok");
      onBack();
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : "Could not send the pigeon.",
      );
      setPageStatus("ready");
    }
  };

  const pigeons = Object.values(
  import.meta.glob<string>(
    "../assets/pigeons/*.{png,jpg,jpeg,webp}",
    { eager: true, query: "?url", import: "default" }
  )
);

  return (
    <div className="app-shell" aria-busy={pageStatus === "loading"}>
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

          <RecepientField
              onRecipientChange={setRecipientName}
              onStatusChange={setReccipientStatus}
          />
          
          <label className="message-field">
            <span>Message</span>
            <textarea ref={messageRef} name="message" rows={7} placeholder="Write your message..." />
          </label>
          {sendError && <p role="alert">{sendError}</p>}
        </form>
      </div>
      <button 
        className="send-button" 
        type="button" 
        aria-label="Send message"
        disabled={pageStatus === "loading"}
        onClick={() => void sendPigeon()}
      >
        <img src={planeImage} alt="" />
      </button>
      {pageStatus === "loading" && (
        <div className="send-loading-overlay" role="status" aria-live="polite">
          <span className="send-loading-spinner" aria-hidden="true" />
          <span className="visually-hidden">Sending message</span>
        </div>
      )}
    </div>
  );
}

export default Send;
