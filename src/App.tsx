import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/auth";
import './App.css'
import { store } from "./store/store";

function App() {
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

  return (
    <div className={isAuthenticated ? "app authenticated" : "app"}>
      {isAuthenticated ? (
        <><h1>E-Pigeon 🕊️</h1><p>Hello user.name {user.name}</p></>
      ) : (
        <h1>Authenticating...</h1>
      )}
    </div>
  );
}

export default App
