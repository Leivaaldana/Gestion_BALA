import {
  collection, doc, onSnapshot, runTransaction, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { hoyISO } from "./turnos";

export const UMBRAL_STOCK = 10;

// Errores de negocio (vencido, sin stock) que sí se le muestran al usuario
export class ErrorStock extends Error {}

export function escucharMedicamentos(callback) {
  return onSnapshot(collection(db, "medicamentos"), (snap) => {
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    callback(lista);
  });
}

// items: [{ medicamentoId, cantidad }]
// Devuelve la lista de medicamentos que quedaron con stock bajo
export async function emitirReceta({ paciente, medico, items, indicaciones }) {
  const recetaRef = doc(collection(db, "recetas"));

  return runTransaction(db, async (tx) => {
    // En una transacción, primero se leen todos los documentos...
    const lecturas = [];
    for (const it of items) {
      const ref = doc(db, "medicamentos", it.medicamentoId);
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new ErrorStock("Un medicamento ya no existe en el sistema.");
      const m = snap.data();
      if (m.fechaVencimiento <= hoyISO()) throw new ErrorStock(`${m.nombre} está vencido.`);
      if (m.stock < it.cantidad)
        throw new ErrorStock(`Stock insuficiente de ${m.nombre}: quedan ${m.stock}.`);
      lecturas.push({ ref, m, cantidad: it.cantidad });
    }

    // ...y recién después se escribe
    const pacienteNombre = `${paciente.nombre} ${paciente.apellido}`;
    tx.set(recetaRef, {
      pacienteDni: paciente.dni,
      pacienteNombre,
      medicoDni: medico.dni,
      medicoNombre: medico.nombre,
      fecha: hoyISO(),
      indicaciones,
      estado: "Vigente",
      items: lecturas.map(({ m, cantidad }) => ({ medicamento: `${m.nombre} ${m.dosis}`, cantidad })),
      creadoEn: serverTimestamp(),
    });

    const bajos = [];
    for (const { ref, m, cantidad } of lecturas) {
      const nuevoStock = m.stock - cantidad;
      tx.update(ref, { stock: nuevoStock });
      tx.set(doc(collection(db, "indicaciones")), {
        recetaId: recetaRef.id,
        pacienteDni: paciente.dni,
        pacienteNombre,
        medicamento: `${m.nombre} ${m.dosis}`,
        cantidad,
        indicaciones,
        administrado: false,
        creadoEn: serverTimestamp(),
      });
      if (nuevoStock < UMBRAL_STOCK) bajos.push(`${m.nombre} (quedan ${nuevoStock})`);
    }
    return bajos;
  });
}

// ---------- Enfermería ----------
export function escucharIndicaciones(callback) {
  return onSnapshot(collection(db, "indicaciones"), (snap) => {
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    lista.sort((a, b) => {
      if (a.administrado !== b.administrado) return a.administrado ? 1 : -1; // pendientes primero
      return (b.creadoEn?.seconds ?? Infinity) - (a.creadoEn?.seconds ?? Infinity);
    });
    callback(lista);
  });
}

export const marcarAdministrada = (id, administrado, user) =>
  updateDoc(doc(db, "indicaciones", id), {
    administrado,
    administradoPor: administrado ? user.nombre : null,
    administradoEn: administrado ? serverTimestamp() : null,
  });