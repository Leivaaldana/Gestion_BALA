import { createContext, useContext, useState } from "react";

// Ruta de inicio de cada rol (la usa el header para el botón "Mi panel")
export const ROLE_HOME = {
  paciente: "/paciente/historial",
  medico: "/medico/historia",
  enfermera: "/enfermera/medicacion",
  administrativo: "/administrativo/altas",
  directivos: "/directivos/recursos",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user = null (sin sesión) o { nombre, rol }
  // Sprint 1: sesión simulada, guardada en localStorage.
  // Sprint 2: se reemplaza por la respuesta real de la API.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bala_user"));
    } catch {
      return null;
    }
  });

  const login = (data) => {
    setUser(data);
    localStorage.setItem("bala_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bala_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
