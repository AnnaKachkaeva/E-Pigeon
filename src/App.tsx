import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/auth";
import { store } from "./store/store";
import Home from "./pages/home";
import History from "./pages/history";
import Send from "./pages/send";

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
    console.log("url", import.meta.env.VITE_AUTH_URL)
    try {
      const initData = window.Telegram?.WebApp.initData;
      if (!initData) {
        console.log("No Telegram initData APP SHOULD BE OPENED FROM TELEGRAM ONLY");
        return;
      }
      const res = await fetch(import.meta.env.VITE_AUTH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            init_data: initData,
            t_user_name: window.Telegram?.WebApp.initDataUnsafe.user?.username,
            t_id: window.Telegram?.WebApp.initDataUnsafe.user?.id,
          }),
      });
      console.log("username", window.Telegram?.WebApp.initDataUnsafe.user?.username)
      console.log("id", window.Telegram?.WebApp.initDataUnsafe.user?.id)

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

  switch (screen) {
    case "history":
      return <History onBack={() => setScreen("home")} />;
    case "send":
      return <Send onBack={() => setScreen("home")} />;
    default:
      return (
        <Home
          isAuthenticated={isAuthenticated}
          user={user}
          onHistory={() => setScreen("history")}
          onSend={() => setScreen("send")}
        />
      );
  }
}

export default App;
