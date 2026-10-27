import { createContext, useContext, useState } from "react";
import { leer, guardar, siguienteId } from "../datos/almacen";
import { USUARIOS_INICIALES } from "../datos/usuarios";

// Panel de inicio de cada rol (lo usan el header y el login)
export const ROLE_HOME = {
  paciente: "/paciente/historial",
  medico: "/medico/historia",
  enfermera: "/enfermera/medicacion",
  administrativo: "/administrativo/altas",
  directivos: "/directivos/recursos",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lista de usuarios registrados (array de objetos con id único)
  const [usuarios, setUsuarios] = useState(() =>
    leer("bala_usuarios", USUARIOS_INICIALES)
  );

  // Sesión actual: null si nadie inició sesión, o { id, dni, nombre, rol }
  const [user, setUser] = useState(() => leer("bala_sesion", null));

  const abrirSesion = (u) => {
    const sesion = {
      id: u.id,
      dni: u.dni,
      rol: u.rol,
      nombre: `${u.nombre} ${u.apellido}`,
    };
    setUser(sesion);
    guardar("bala_sesion", sesion);
    return sesion;
  };

  // Devuelve { ok: true, rol } o { ok: false, error }
  const login = (dni, contrasena) => {
    const encontrado = usuarios.find(
      (u) => u.dni === dni.trim() && u.contrasena === contrasena
    );
    if (!encontrado) {
      return { ok: false, error: "DNI o contraseña incorrectos." };
    }
    abrirSesion(encontrado);
    return { ok: true, rol: encontrado.rol };
  };

  // Crea un paciente nuevo e inicia su sesión.
  // (Médicos, enfermeros, etc. no se registran solos: los carga la administración.)
  const registrar = ({ dni, nombre, apellido, email, contrasena }) => {
    if (usuarios.some((u) => u.dni === dni.trim())) {
      return { ok: false, error: "Ya existe una cuenta con ese DNI." };
    }
    if (usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }

    const nuevo = {
      id: siguienteId(usuarios),
      dni: dni.trim(),
      contrasena,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      rol: "paciente",
    };

    const lista = [...usuarios, nuevo];
    setUsuarios(lista);
    guardar("bala_usuarios", lista);
    abrirSesion(nuevo);
    return { ok: true, rol: nuevo.rol };
  };

  const logout = () => {
    setUser(null);
    guardar("bala_sesion", null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
