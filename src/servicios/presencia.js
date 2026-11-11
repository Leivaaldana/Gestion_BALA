import {
  collection, doc, getCountFromServer, onSnapshot, query, serverTimestamp,
  setDoc, Timestamp, where,
} from "firebase/firestore";
import { db } from "../firebase";

const VENTANA_ACTIVA_MS = 2 * 60 * 1000;

export async function contarPacientesRegistrados() {
  const pacientes = query(collection(db, "usuarios"), where("rol", "==", "paciente"));
  const resultado = await getCountFromServer(pacientes);
  return resultado.data().count;
}

export function escucharPacientesActivos(callback, onError) {
  let cancelar;
  const escuchar = () => {
    cancelar?.();
    const desde = Timestamp.fromMillis(Date.now() - VENTANA_ACTIVA_MS);
    const presencia = query(
      collection(db, "presencias_pacientes"),
      where("actualizadoEn", ">=", desde)
    );
    cancelar = onSnapshot(presencia, (snap) => callback(snap.size), onError);
  };

  escuchar();
  const intervalo = setInterval(escuchar, 30_000);
  return () => {
    clearInterval(intervalo);
    cancelar?.();
  };
}

export function actualizarPresenciaPaciente(dni) {
  return setDoc(
    doc(db, "presencias_pacientes", dni),
    { actualizadoEn: serverTimestamp() },
    { merge: true }
  );
}
