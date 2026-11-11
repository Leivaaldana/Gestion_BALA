import {
  collection, doc, getDocs, onSnapshot, query, runTransaction,
  serverTimestamp, updateDoc, where, writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const pad = (n) => String(n).padStart(2, "0");

// Turnos de 30 minutos dentro del horario de atención: 09:00 a 16:00.
export const HORARIOS = Array.from(
  { length: 14 },
  (_, i) => `${pad(9 + Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`
);

export const hoyISO = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD local
export const formatearFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");
export const esDiaHabil = (fecha) => {
  if (!fecha) return false;
  const dia = new Date(`${fecha}T00:00:00`).getDay();
  return dia >= 1 && dia <= 5;
};

export async function listarMedicos() {
  const snap = await getDocs(query(collection(db, "usuarios"), where("rol", "==", "medico")));
  return snap.docs.map((d) => d.data());
}

export async function horariosOcupados(medicoDni, fecha) {
  const snap = await getDocs(
    query(
      collection(db, "disponibilidad_turnos"),
      where("medicoDni", "==", medicoDni),
      where("fecha", "==", fecha)
    )
  );
  return snap.docs
    .map((d) => d.data())
    .filter((slot) => slot.estado === "Ocupado")
    .map((slot) => slot.hora);
}

// Lanza Error("OCUPADO") si ese médico ya tiene un turno activo a esa hora
export async function reservarTurno(t) {
  if (!esDiaHabil(t.fecha) || !HORARIOS.includes(t.hora)) {
    throw new Error("FUERA_DE_HORARIO");
  }

  const id = `${t.medicoDni}_${t.fecha}_${t.hora.replace(":", "")}`;
  const turnoRef = doc(db, "turnos", id);
  const disponibilidadRef = doc(db, "disponibilidad_turnos", id);
  await runTransaction(db, async (tx) => {
    const slot = await tx.get(disponibilidadRef);
    if (slot.exists() && slot.data().estado === "Ocupado") throw new Error("OCUPADO");
    tx.set(turnoRef, { ...t, estado: "Pendiente", creadoEn: serverTimestamp() });
    tx.set(disponibilidadRef, {
      medicoDni: t.medicoDni,
      fecha: t.fecha,
      hora: t.hora,
      estado: "Ocupado",
    });
  });
}

export async function sincronizarDisponibilidad(turnos) {
  const activos = turnos.filter(
    (turno) => turno.estado === "Pendiente" || turno.estado === "Confirmado"
  );
  for (let inicio = 0; inicio < activos.length; inicio += 450) {
    const batch = writeBatch(db);
    activos.slice(inicio, inicio + 450).forEach((turno) => {
      const id = `${turno.medicoDni}_${turno.fecha}_${turno.hora.replace(":", "")}`;
      batch.set(doc(db, "disponibilidad_turnos", id), {
        medicoDni: turno.medicoDni,
        fecha: turno.fecha,
        hora: turno.hora,
        estado: "Ocupado",
      });
    });
    await batch.commit();
  }
}

// Tiempo real. Sin filtros trae todos; cada filtro usa { campo, valor }.
export function escucharTurnos(callback, filtros = [], onError) {
  const base = collection(db, "turnos");
  const clausulas = (Array.isArray(filtros) ? filtros : [filtros])
    .filter(Boolean)
    .map(({ campo, valor }) => where(campo, "==", valor));
  const q = clausulas.length ? query(base, ...clausulas) : base;
  return onSnapshot(
    q,
    (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lista.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
      callback(lista);
    },
    onError
  );
}

export async function cambiarEstadoTurno(id, estado) {
  const turnoRef = doc(db, "turnos", id);
  if (estado !== "Cancelado") {
    await updateDoc(turnoRef, { estado });
    return;
  }

  const disponibilidadRef = doc(db, "disponibilidad_turnos", id);
  await runTransaction(db, async (tx) => {
    const turno = await tx.get(turnoRef);
    const slot = await tx.get(disponibilidadRef);
    if (!turno.exists()) throw new Error("TURNO_INEXISTENTE");

    tx.update(turnoRef, { estado });
    if (slot.exists()) tx.update(disponibilidadRef, { estado: "Disponible" });
  });
}