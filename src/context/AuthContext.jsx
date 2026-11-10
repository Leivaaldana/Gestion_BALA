import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
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

// Se conserva para permitir el acceso a cuentas creadas antes de usar el correo real.
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
        const correo = fbUser.email?.trim().toLowerCase() || "";
        if (correo.endsWith("@bala.app")) {
          const dni = correo.split("@")[0];
          const snap = await getDoc(doc(db, "usuarios", dni));
          setUser(snap.exists() ? armarSesion(snap.data()) : null);
        } else {
          const perfiles = await getDocs(
            query(collection(db, "usuarios"), where("email", "==", correo))
          );
          setUser(perfiles.empty ? null : armarSesion(perfiles.docs[0].data()));
        }
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
      const dniNormalizado = dni.trim();
      const snap = await getDoc(doc(db, "usuarios", dniNormalizado));
      if (!snap.exists()) {
        return { ok: false, error: "Tu cuenta no tiene un perfil asignado." };
      }
      const perfil = snap.data();
      const correo = perfil.email?.trim().toLowerCase();
      let cred;
      let cuentaAnterior = false;

      if (correo) {
        try {
          cred = await signInWithEmailAndPassword(auth, correo, contrasena);
        } catch (e) {
          if (e.code !== "auth/user-not-found" && e.code !== "auth/invalid-credential") throw e;
          cred = await signInWithEmailAndPassword(auth, emailInterno(dniNormalizado), contrasena);
          cuentaAnterior = true;
        }
      } else {
        cred = await signInWithEmailAndPassword(auth, emailInterno(dniNormalizado), contrasena);
      }

      if (cuentaAnterior && correo) {
        try {
          await updateEmail(cred.user, correo);
        } catch (e) {
          await signOut(auth);
          if (e.code === "auth/email-already-in-use") {
            return {
              ok: false,
              error: "Ese correo ya está asociado a otra cuenta de Firebase. Contactá a administración para revisar tus datos.",
            };
          }
          return {
            ok: false,
            error: "No se pudo actualizar el correo de tu cuenta para habilitar la recuperación. Probá de nuevo o contactá a administración.",
          };
        }
      }

      const sesion = armarSesion(perfil);
      setUser(sesion);
      return { ok: true, rol: sesion.rol };
    } catch (e) {
      if (e.code === "auth/network-request-failed")
        return { ok: false, error: "No se pudo conectar con Firebase. Revisá tu conexión e intentá de nuevo." };
      return { ok: false, error: "DNI o contraseña incorrectos." };
    }
  };

  const recuperarContrasena = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
      return { ok: true };
    } catch (e) {
      if (e.code === "auth/user-not-found") return { ok: true };
      if (e.code === "auth/too-many-requests")
        return { ok: false, error: "Se realizaron demasiados intentos. Esperá un momento antes de volver a probar." };
      if (e.code === "auth/network-request-failed")
        return { ok: false, error: "No se pudo conectar con Firebase. Revisá tu conexión e intentá de nuevo." };
      if (e.code === "auth/operation-not-allowed")
        return { ok: false, error: "La recuperación por correo no está habilitada en Firebase Authentication." };
      if (e.code === "auth/unauthorized-continue-uri" || e.code === "auth/invalid-continue-uri")
        return { ok: false, error: "El dominio de esta aplicación no está autorizado en Firebase Authentication." };
      if (e.code === "auth/invalid-email")
        return { ok: false, error: "Ingresá una dirección de correo válida." };
      return { ok: false, error: "No se pudo enviar el correo de recuperación. Intentá de nuevo más tarde." };
    }
  };

  // Solo registra pacientes (el resto de roles los carga la administración)
  const registrar = async ({ dni, nombre, apellido, email, contrasena }) => {
    const emailNorm = email.trim().toLowerCase();
    registrando.current = true;
    try {
      const dup = await getDocs(query(collection(db, "usuarios"), where("email", "==", emailNorm)));
      if (!dup.empty) return { ok: false, error: "Ya existe una cuenta con ese correo." };

      await createUserWithEmailAndPassword(auth, emailNorm, contrasena);

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
        return { ok: false, error: "Ese correo ya está asociado a una cuenta." };
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
    <AuthContext.Provider value={{ user, login, logout, registrar, recuperarContrasena }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}