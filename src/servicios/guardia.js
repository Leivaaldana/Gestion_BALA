import {
  addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const PRIORIDADES = ["Baja", "Media", "Alta", "Urgente"];
const ORDEN = { Urgente: 0, Alta: 1, Media: 2, Baja: 3 };

const quitarTildes = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const REGLAS = [
  { prioridad: "Urgente", palabras: ["dolor de pecho", "dificultad para respirar", "falta de aire", "no respira", "inconsciente", "desmayo", "convulsion", "hemorragia", "sangrado abundante", "paro", "acv", "politraumatismo", "quemadura grave"] },
  { prioridad: "Alta", palabras: ["fractura", "fiebre alta", "dolor intenso", "vomitos", "herida profunda", "deshidrat", "mareo", "dolor abdominal", "trauma"] },
  { prioridad: "Media", palabras: ["fiebre", "dolor", "herida", "tos", "corte", "esguince", "diarrea"] },
];

// Devuelve la prioridad sugerida según palabras clave (Baja si no encuentra ninguna)
export function calcularPrioridad(sintomas) {
  const texto = quitarTildes(sintomas || "");
  if (!texto.trim()) return "Baja";
  for (const { prioridad, palabras } of REGLAS) {
    if (palabras.some((p) => texto.includes(p))) return prioridad;
  }
  return "Baja";
}

export const registrarIngreso = (datos, user) =>
  addDoc(collection(db, "guardia"), {
    ...datos,
    estado: "En espera",
    registradoPor: user.nombre,
    creadoEn: serverTimestamp(),
  });

// Activos primero; dentro de cada grupo, por urgencia y luego por orden de llegada
export function escucharGuardia(callback, onError) {
  return onSnapshot(
    collection(db, "guardia"),
    (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const activo = (g) => (g.estado === "Atendido" ? 1 : 0);
      lista.sort(
        (a, b) =>
          activo(a) - activo(b) ||
          ORDEN[a.prioridad] - ORDEN[b.prioridad] ||
          (a.creadoEn?.seconds ?? Infinity) - (b.creadoEn?.seconds ?? Infinity)
      );
      callback(lista);
    },
    onError
  );
}

export const cambiarEstadoGuardia = (id, estado, extra = {}) =>
  updateDoc(doc(db, "guardia", id), { estado, ...extra });