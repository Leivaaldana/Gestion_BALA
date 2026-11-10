import {
  collection, doc, getDocs, onSnapshot, query,
  runTransaction, serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import { db } from "../firebase";

const pad = (n) => String(n).padStart(2, "0");

// 08:00, 08:30 ... 19:30
export const HORARIOS = Array.from(
  { length: 24 },
  (_, i) => `${pad(8 + Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`
);

export const hoyISO = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD local
export const formatearFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

export async function listarMedicos() {
  const snap = await getDocs(query(collection(db, "usuarios"), where("rol", "==", "medico")));
  return snap.docs.map((d) => d.data());
}

export async function horariosOcupados(medicoDni, fecha) {
  const snap = await getDocs(
    query(collection(db, "turnos"), where("medicoDni", "==", medicoDni), where("fecha", "==", fecha))
  );
  return snap.docs.map((d) => d.data()).filter((t) => t.estado !== "Cancelado").map((t) => t.hora);
}

// Lanza Error("OCUPADO") si ese médico ya tiene un turno activo a esa hora
export async function reservarTurno(t) {
  const ref = doc(db, "turnos", `${t.medicoDni}_${t.fecha}_${t.hora.replace(":", "")}`);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists() && snap.data().estado !== "Cancelado") throw new Error("OCUPADO");
    tx.set(ref, { ...t, estado: "Pendiente", creadoEn: serverTimestamp() });
  });
}

// Tiempo real. Sin filtro trae todos; con filtro { campo, valor } solo los que coinciden.
export function escucharTurnos(callback, filtro) {
  const base = collection(db, "turnos");
  const q = filtro ? query(base, where(filtro.campo, "==", filtro.valor)) : base;
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    lista.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    callback(lista);
  });
}

export const cambiarEstadoTurno = (id, estado) =>
  updateDoc(doc(db, "turnos", id), { estado });