import { useEffect, useState } from "react";

export type RecepientStatus = "loading" | "checked_ok" | "error";

type StatusRecepientProps = {
    onRecipientChange: (recepient: string) => void;
    onStatusChange: (status: RecepientStatus) => void;
};

export function RecepientField({
    onRecipientChange,
    onStatusChange
}: StatusRecepientProps) {
    const [recipientStatus, setRecepientStatus] = useState("checked_ok");
    const [toRandom, setToRandom] = useState(false);
    const [recipient, setRecepient] = useState("");

    async function handleSendToServer(value: string) {
        try {
            console.log("in checking", recipient)
            setRecepientStatus('loading')
            const url = new URL("/check-user", import.meta.env.VITE_AUTH_URL);
            url.search = new URLSearchParams({
                recipient_name: value.trim(),
            }).toString();

            const response = await fetch(url);

            if (!response.ok) {
                setRecepientStatus('error');
                throw new Error(`Request failed (${response.status})`);
            }
            setRecepientStatus('checked_ok')

            const isValid: unknown = await response.json();
            onStatusChange(isValid ? "checked_ok" : "error");
            setRecepientStatus(isValid ? "checked_ok" : "error")
            console.log("Check user", isValid);
        } catch (error) {
            setRecepientStatus('error')
            console.log("in ERRROR")
            console.log(error)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSendToServer(recipient);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [recipient]);

  return (
    <div className="recipient-row">
        <label className="message-field-user recipient-field">
            <span>To</span>
            <input
            type="text"
            name="recipient"
            placeholder="Recipient"
            value={recipient}
            onChange={(event) => {
                onRecipientChange(event.target.value);
                setRecepient(event.target.value);
            }}
            disabled={toRandom}
            />
        </label>

        <label className="random-recipient-toggle">
            <input
            type="checkbox"
            name="toRandom"
            checked={toRandom}
            onChange={(event) => {
                setToRandom(event.target.checked);
                setRecepient('random')
            }}
            />
            <span className="toggle-control" aria-hidden="true" />
            <span>To random</span>
        </label>
    </div>
  );
}