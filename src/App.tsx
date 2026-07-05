import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div>
      <h1>E-Pigeon 🕊️1</h1>
      <p>Hello {window.Telegram?.WebApp.initDataUnsafe.user.username}</p>
    </div>
  );
}

export default App
