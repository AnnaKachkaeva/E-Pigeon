import { useState } from "react";

type HomeProps = {
  isAuthenticated: boolean;
  user: { name: string } | null;
  onHistory: () => void;
  onSend: () => void;
};

function Home({ isAuthenticated, user, onHistory, onSend }: HomeProps) {
  return (
    <div className="app-shell">
      <div className={isAuthenticated ? "home-panel" : "app"}>
        {isAuthenticated || import.meta.env.VITE_ENV === "test" ? (
          <>
            <h1>E-Pigeon 🕊️</h1> <p>Hello user.name {user?.name}</p>
            <div className="action-buttons">
              <button onClick={onHistory}>history</button>
              <button onClick={onSend}>send a pigeon</button>
            </div>
          </>
        ) : (
          <h1>Authenticating...</h1>
        )}
      </div>
    </div>
  );
}

export default Home;
