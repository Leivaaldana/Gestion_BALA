import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

export const ROLE_HOME = {
  paciente: "/paciente/historial",
  medico: "/medico/historia",
  enfermera: "/enfermera/medicacion",
  administrativo: "/administrativo/altas",
  directivos: "/directivos/recursos",
};

// Firebase Auth pide un email: usamos el DNI como email interno
const emailInterno = (dni) => `${dni.trim()}@bala.app`;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);
  const registrando = useRef(false); // evita la carrera entre crear la cuenta y guardar el perfil

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, async (fbUser) => {
      if (registrando.current) return;
      if (!fbUser) {
        setUser(null);
        setCargando(false);
        return;
      }
      try {
        const dni = fbUser.email.split("@")[0];
        const snap = await getDoc(doc(db, "usuarios", dni));
        setUser(snap.exists() ? armarSesion(snap.data()) : null);
      } catch {
        setUser(null);
      }
      setCargando(false);
    });
    return cancelar;
  }, []);

  const armarSesion = (u) => ({
    dni: u.dni,
    rol: u.rol,
    nombre: `${u.nombre} ${u.apellido}`,
  });

  // Devuelve { ok: true, rol } o { ok: false, error }
  const login = async (dni, contrasena) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, emailInterno(dni), contrasena);
      const snap = await getDoc(doc(db, "usuarios", dni.trim()));
      if (!snap.exists()) {
        await signOut(auth);
        return { ok: false, error: "Tu cuenta no tiene un perfil asignado." };
      }
      const sesion = armarSesion(snap.data());
      setUser(sesion);
      return { ok: true, rol: sesion.rol };
    } catch (e) {
      return { ok: false, error: "DNI o contraseña incorrectos." };
    }
  };

  // Solo registra pacientes (el resto de roles los carga la administración)
  const registrar = async ({ dni, nombre, apellido, email, contrasena }) => {
    const emailNorm = email.trim().toLowerCase();
    registrando.current = true;
    try {
      const dup = await getDocs(query(collection(db, "usuarios"), where("email", "==", emailNorm)));
      if (!dup.empty) return { ok: false, error: "Ya existe una cuenta con ese correo." };

      await createUserWithEmailAndPassword(auth, emailInterno(dni), contrasena);

      const perfil = {
        dni: dni.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: emailNorm,
        rol: "paciente",
      };
      await setDoc(doc(db, "usuarios", perfil.dni), perfil);

      const sesion = armarSesion(perfil);
      setUser(sesion);
      return { ok: true, rol: "paciente" };
    } catch (e) {
      if (e.code === "auth/email-already-in-use")
        return { ok: false, error: "Ya existe una cuenta con ese DNI." };
      if (e.code === "auth/weak-password")
        return { ok: false, error: "La contraseña es muy débil." };
      return { ok: false, error: "No se pudo crear la cuenta. Probá de nuevo." };
    } finally {
      registrando.current = false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registrar }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}