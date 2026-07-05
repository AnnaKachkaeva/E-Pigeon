import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const tg = window.Telegram.WebApp;

  return (
    <div>
      <h1>E-Pigeon 🕊️</h1>
      <p>Hello {tg.initDataUnsafe.user.username}</p>
    </div>
  );
}

export default App
