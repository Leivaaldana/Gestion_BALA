import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from './paginas/Principal.jsx'
import Header from './Components/header.jsx'

function App() {
  return (
    <div className="app">
      <Header />
      <Home />
    </div>
  )
}


export default App