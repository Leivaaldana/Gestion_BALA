import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Principal from './paginas/Principal.jsx'
import { Routes, Route } from "react-router-dom";
import Navbar from './componentes/nav.jsx'


function App() {
  return (
    <div>
      <Navbar userRole="Administrador" userName="Agustin Rios" />

      <Routes>
        <Route path="/" element={<Principal />} />
      </Routes>
    </div>
  );
}


export default App