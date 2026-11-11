import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
} from "firebase/auth";
import {
  doc, getDoc, setDoc, getDocs, query, where, collection, limit,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import PantallaCarga from "../componentes/PantallaCarga.jsx";

export const ROLE_HOME = {
  paciente: "/paciente/historial",
  medico: "/medico/historia",
  enfermera: "/enfermera/medicacion",
  administrativo: "/administrativo/altas",
  directivos: "/directivos/recursos",
};

// Se conserva para permitir el acceso a cuentas creadas antes de usar el correo real.
const emailInterno = (dni) => `${dni.trim()}@bala.app`;

async function buscarPerfilPorCuenta(cuenta) {
  const correo = cuenta.email?.trim().toLowerCase() || "";
  if (correo.endsWith("@bala.app")) {
    const dni = correo.slice(0, -"@bala.app".length);
    const perfil = await getDoc(doc(db, "usuarios", dni));
    return perfil.exists() ? perfil.data() : null;
  }

  if (!correo) return null;
  const perfiles = await getDocs(
    query(collection(db, "usuarios"), where("email", "==", correo), limit(1))
  );
  return perfiles.empty ? null : perfiles.docs[0].data();
}

async function armarSesion(perfil) {
  const foto = await getDoc(doc(db, "fotos_perfil", perfil.dni));
  return {
    dni: perfil.dni,
    rol: perfil.rol,
    nombre: `${perfil.nombre} ${perfil.apellido}`,
    nombrePila: perfil.nombre,
    apellido: perfil.apellido,
    email: perfil.email,
    especialidad: perfil.especialidad || "",
    fotoPerfil: foto.exists() ? foto.data().fotoPerfil : "",
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [operacion, setOperacion] = useState("");
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
        const perfil = await buscarPerfilPorCuenta(fbUser);
        setUser(perfil ? await armarSesion(perfil) : null);
      } catch {
        setUser(null);
      }
      setCargando(false);
    });
    return cancelar;
  }, []);

  // Devuelve { ok: true, rol } o { ok: false, error }
  const login = async (identificador, contrasena) => {
    setOperacion("Iniciando sesión de forma segura…");
    let sesionIniciada = false;
    try {
      const valor = identificador.trim();
      const usaCorreo = valor.includes("@");
      const correoLogin = usaCorreo ? valor.toLowerCase() : emailInterno(valor);
      const cred = await signInWithEmailAndPassword(auth, correoLogin, contrasena);
      sesionIniciada = true;

      const perfil = await buscarPerfilPorCuenta(cred.user);
      if (!perfil) {
        await signOut(auth);
        return {
          ok: false,
          error: "La cuenta inició sesión, pero no tiene un perfil asociado en Firestore.",
        };
      }

      const correoPerfil = perfil.email?.trim().toLowerCase();
      const esCuentaAnterior = cred.user.email?.toLowerCase().endsWith("@bala.app");
      if (esCuentaAnterior && correoPerfil) {
        try {
          await updateEmail(cred.user, correoPerfil);
        } catch (e) {
          if (e.code !== "auth/email-already-in-use") {
            console.error("No se pudo migrar el correo de la cuenta antigua:", e);
          }
        }
      }

      const sesion = await armarSesion(perfil);
      setUser(sesion);
      return { ok: true, rol: sesion.rol };
    } catch (e) {
      if (sesionIniciada) await signOut(auth);
      if (e.code === "permission-denied")
        return {
          ok: false,
          error: "Firebase Authentication aceptó la cuenta, pero Firestore bloqueó la lectura del perfil. Revisá las reglas de la colección usuarios.",
        };
      if (e.code === "auth/network-request-failed")
        return { ok: false, error: "No se pudo conectar con Firebase. Revisá tu conexión e intentá de nuevo." };
      if (e.code === "auth/operation-not-allowed")
        return { ok: false, error: "El acceso con correo y contraseña no está habilitado en Firebase Authentication." };
      return { ok: false, error: "DNI o contraseña incorrectos." };
    } finally {
      setOperacion("");
    }
  };

  const recuperarContrasena = async (email) => {
    setOperacion("Enviando el enlace de recuperación…");
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
    } finally {
      setOperacion("");
    }
  };

  const actualizarFotoPerfil = async (fotoPerfil) => {
    if (!user?.dni) throw new Error("No hay una sesión activa.");
    if (typeof fotoPerfil !== "string" || fotoPerfil.length > 250000)
      throw new Error("La imagen excede el tamaño permitido.");

    setOperacion("Actualizando tu foto de perfil…");
    try {
      await setDoc(
        doc(db, "fotos_perfil", user.dni),
        { fotoPerfil },
        { merge: true }
      );
      setUser((actual) => ({ ...actual, fotoPerfil }));
    } finally {
      setOperacion("");
    }
  };

  // Solo registra pacientes (el resto de roles los carga la administración)
  const registrar = async ({ dni, nombre, apellido, email, contrasena }) => {
    const emailNorm = email.trim().toLowerCase();
    registrando.current = true;
    setOperacion("Creando tu cuenta…");
    let cuentaCreada = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, emailNorm, contrasena);
      cuentaCreada = cred.user;
      const dup = await getDocs(
        query(collection(db, "usuarios"), where("email", "==", emailNorm), limit(1))
      );
      if (!dup.empty) {
        await deleteUser(cred.user);
        cuentaCreada = null;
        return { ok: false, error: "Ya existe una cuenta con ese correo." };
      }

      const perfil = {
        dni: dni.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: emailNorm,
        rol: "paciente",
      };
      await setDoc(doc(db, "usuarios", perfil.dni), perfil);
      cuentaCreada = null;

      const sesion = await armarSesion(perfil);
      setUser(sesion);
      return { ok: true, rol: "paciente" };
    } catch (e) {
      if (cuentaCreada) {
        try {
          await deleteUser(cuentaCreada);
        } catch (deleteError) {
          console.error("No se pudo limpiar la cuenta de Auth después de fallar el registro:", deleteError);
        }
      }
      if (e.code === "auth/email-already-in-use")
        return { ok: false, error: "Ese correo ya está asociado a una cuenta." };
      if (e.code === "auth/weak-password")
        return { ok: false, error: "La contraseña es muy débil." };
      return { ok: false, error: "No se pudo crear la cuenta. Probá de nuevo." };
    } finally {
      registrando.current = false;
      setOperacion("");
    }
  };

  const logout = async () => {
    setOperacion("Cerrando tu sesión…");
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setOperacion("");
    }
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, registrar, recuperarContrasena, actualizarFotoPerfil,
    }}>
      {!cargando && children}
      {(cargando || operacion) && (
        <PantallaCarga
          mensaje={cargando ? "Conectando con tu espacio seguro…" : operacion}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}