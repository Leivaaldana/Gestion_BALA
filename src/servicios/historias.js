import {
  addDoc, collection, doc, getDoc, onSnapshot, query,
  serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { db } from "../firebase";

export const HISTORIAL_VACIO = { grupoSanguineo: "", alergias: "Ninguna", medicacionHabitual: "Ninguna" };

// Devuelve el perfil si existe y es paciente; si no, null
export async function buscarPaciente(dni) {
  const snap = await getDoc(doc(db, "usuarios", dni));
  if (!snap.exists() || snap.data().rol !== "paciente") return null;
  return snap.data();
}

export async function obtenerHistorial(dni) {
  const snap = await getDoc(doc(db, "historiales", dni));
  return snap.exists() ? { ...HISTORIAL_VACIO, ...snap.data() } : HISTORIAL_VACIO;
}

export const guardarHistorial = (dni, datos) =>
  setDoc(doc(db, "historiales", dni), datos, { merge: true });

export function escucharHistorial(dni, callback) {
  return onSnapshot(doc(db, "historiales", dni), (snap) =>
    callback(snap.exists() ? { ...HISTORIAL_VACIO, ...snap.data() } : HISTORIAL_VACIO)
  );
}

export function escucharConsultas(pacienteDni, callback, onError) {
  const q = query(collection(db, "consultas"), where("pacienteDni", "==", pacienteDni));
  return onSnapshot(
    q,
    (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
      callback(lista);
    },
    onError
  );
}

export const registrarConsulta = (c) =>
  addDoc(collection(db, "consultas"), { ...c, creadoEn: serverTimestamp() });

// ---------- Auditoría ----------
export const registrarAuditoria = (user, accion, entidad) =>
  addDoc(collection(db, "auditoria"), {
    usuarioDni: user.dni,
    usuarioNombre: user.nombre,
    usuarioEmail: user.email,
    rol: user.rol,
    accion,
    entidad,
    creadoEn: serverTimestamp(),
  }).catch((error) => {
    console.error("No se pudo registrar la auditoría:", error);
  });

export function escucharAuditoria(callback, onError) {
  return onSnapshot(
    collection(db, "auditoria"),
    (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lista.sort((a, b) => (b.creadoEn?.seconds ?? Infinity) - (a.creadoEn?.seconds ?? Infinity));
      callback(lista);
    },
    onError
  );
}