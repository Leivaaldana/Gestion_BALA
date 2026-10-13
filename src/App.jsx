import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Principal from './paginas/Principal.jsx'
import { Routes, Route } from "react-router-dom";
import Navbar from './componentes/PageHeader.jsx'
import Contacto from './paginas/Contactos'
import Login from './paginas/Login.jsx'
import MiHistorialClinico from "./paginas/paciente/MiHistorialClinico";


function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout role="paciente" />}>
        <Route path="/paciente/historial" element={<MiHistorialClinico />} />
      </Route>
      <Route path="/" element={<Principal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  );
}

export default App