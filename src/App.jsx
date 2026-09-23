import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Layout from "./layouts/Layout.jsx";
import Principal from './paginas/Principal.jsx'
import { Routes, Route } from "react-router-dom";
import Navbar from './componentes/nav.jsx'
import Contacto from './paginas/Contactos'
import Login from './paginas/Login.jsx'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/contacto" element={<Contacto />} />
      </Route>
    </Routes>
  );
}

export default App