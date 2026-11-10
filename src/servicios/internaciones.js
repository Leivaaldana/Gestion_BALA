import {
  addDoc, collection, doc, onSnapshot, query, runTransaction,
  serverTimestamp, where,
} from "firebase/firestore";
import { db } from "../firebase";

export const TIPOS_ORDEN = ["Internación", "Derivación a otra especialidad", "Reprogramación de turno"];
export const SECTORES = ["Internación", "Terapia intensiva", "Guardia", "Maternidad"];

export class ErrorCama extends Error {}

export function escucharHabitaciones(callback, onError) {
  return onSnapshot(
    collection(db, "habitaciones"),
    (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lista.sort((a, b) => a.piso - b.piso || a.numero - b.numero);
      callback(lista);
    },
    onError
  );
}

export const emitirOrden = (datos, user) =>
  addDoc(collection(db, "ordenes"), {
    ...datos,
    medicoDni: user.dni,
    medicoNombre: user.nombre,
    estado: datos.tipo === "Internación" ? "Pendiente" : "Registrada",
    creadoEn: serverTimestamp(),
  });

// Sin filtro trae todas; con { campo, valor } solo las que coinciden
export function escucharOrdenes(callback, filtro) {
  const base = collection(db, "ordenes");
  const q = filtro ? query(base, where(filtro.campo, "==", filtro.valor)) : base;
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    lista.sort((a, b) => (b.creadoEn?.seconds ?? Infinity) - (a.creadoEn?.seconds ?? Infinity));
    callback(lista);
  });
}

// Asigna una cama libre a una orden de internación pendiente
export async function asignarCama(orden, habitacion) {
  const habRef = doc(db, "habitaciones", habitacion.id);
  const ordRef = doc(db, "ordenes", orden.id);
  const intRef = doc(collection(db, "internaciones"));

  await runTransaction(db, async (tx) => {
    const [h, o] = await Promise.all([tx.get(habRef), tx.get(ordRef)]);
    if (!h.exists() || h.data().estado !== "disponible")
      throw new ErrorCama("Esa habitación ya no está disponible.");
    if (!o.exists() || o.data().estado !== "Pendiente")
      throw new ErrorCama("Esa orden ya fue atendida.");

    tx.set(intRef, {
      pacienteDni: orden.pacienteDni,
      pacienteNombre: orden.pacienteNombre,
      habitacionId: habitacion.id,
      habitacionNumero: habitacion.numero,
      sector: habitacion.sector,
      ordenId: orden.id,
      motivo: orden.motivo,
      estado: "Activa",
      fechaIngreso: serverTimestamp(),
    });
    tx.update(habRef, {
      estado: "ocupada",
      pacienteDni: orden.pacienteDni,
      pacienteNombre: orden.pacienteNombre,
      internacionId: intRef.id,
    });
    tx.update(ordRef, {
      estado: "Asignada",
      habitacionNumero: habitacion.numero,
    });
  });
}

// Libera la cama y cierra la internación
export async function darAlta(habitacion) {
  const habRef = doc(db, "habitaciones", habitacion.id);
  await runTransaction(db, async (tx) => {
    const h = await tx.get(habRef);
    if (!h.exists() || h.data().estado !== "ocupada")
      throw new ErrorCama("Esa habitación ya estaba libre.");
    const intId = h.data().internacionId;
    if (intId) {
      tx.update(doc(db, "internaciones", intId), {
        estado: "Finalizada",
        fechaAlta: serverTimestamp(),
      });
    }
    tx.update(habRef, {
      estado: "disponible",
      pacienteDni: null,
      pacienteNombre: null,
      internacionId: null,
    });
  });
}