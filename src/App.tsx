import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/auth";
import { store } from "./store/store";

type Screen = "home" | "history" | "send";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);  
  
  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    try {
      const initData = window.Telegram?.WebApp.initData;
      if (!initData) {
        console.log("No Telegram initData APP SHOULD BE OPENED FROM TELEGRAM ONLY");
        return;
      }
      const res = await fetch(
        "https://pigeons-server-production.up.railway.app/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            init_data: initData,
          }),
        }
      );
      if (!res.ok) { return; }
      const data = await res.json();

      if (data?.authenticated) {
        console.log(data)
        dispatch(login({
          id: window.Telegram?.WebApp.initDataUnsafe.user?.id,
          name: window.Telegram?.WebApp.initDataUnsafe.user?.username || 'default_name'
        } as any))
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "history":
        return (
          <div className="content-panel">
            <button className="back-button" onClick={() => setScreen("home")}>
              ← back
            </button>
            <h1>history</h1>
            <p>Your previous pigeons will appear here.</p>
          </div>
        );
      case "send":
        return (
          <div className="content-panel">
            <button className="back-button" onClick={() => setScreen("home")}>
              ← back
            </button>
            <h1>send a pigeon</h1>
            <p>Compose your message and send it.</p>
          </div>
        );
      default:
        return (
          <div className={isAuthenticated ? "home-panel" : "app"}>
            {isAuthenticated ? (
              <>
                <h1>E-Pigeon 🕊️</h1> <p>Hello user.name {user?.name}</p>
                <div className="action-buttons">
                  <button onClick={() => setScreen("history")}>history</button>
                  <button onClick={() => setScreen("send")}>send a pigeon</button>
                </div>
              </>
            ) : (
              <h1>Authenticating...</h1>
            )}
          </div>
        );
    }
  };

  return <div className="app-shell">{renderScreen()}</div>;
}

export default App;
