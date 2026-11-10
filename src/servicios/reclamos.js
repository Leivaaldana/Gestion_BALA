import emailjs from "@emailjs/browser";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const reclamosRef = collection(db, "reclamos");

export function enviarReclamo({ nombre, email, asunto, mensaje }) {
  return addDoc(reclamosRef, {
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    asunto: asunto.trim(),
    mensaje: mensaje.trim(),
    estado: "Pendiente",
    respuestas: [],
    creadoEn: serverTimestamp(),
  });
}

export function escucharReclamos(callback, onError) {
  return onSnapshot(
    reclamosRef,
    (snap) => {
      const lista = snap.docs.map((registro) => ({ id: registro.id, ...registro.data() }));
      lista.sort((a, b) => (b.creadoEn?.seconds ?? 0) - (a.creadoEn?.seconds ?? 0));
      callback(lista);
    },
    onError
  );
}

export async function responderReclamo(reclamo, respuesta, usuario) {
  const texto = respuesta.trim();
  const asuntoOriginal = reclamo.asunto.replace(/[\r\n]+/g, " ").trim();
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey)
    throw new Error("Falta configurar EmailJS. Revisá las variables VITE_EMAILJS_* y reiniciá la aplicación.");

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: reclamo.email,
        to_name: reclamo.nombre,
        subject: `Respuesta a tu consulta: ${asuntoOriginal}`,
        message: texto,
      },
      { publicKey }
    );
  } catch (e) {
    const detalle = typeof e?.text === "string" ? e.text : e?.message;
    throw new Error(detalle ? `EmailJS no pudo enviar el correo: ${detalle}` : "EmailJS no pudo enviar el correo.");
  }

  try {
    await updateDoc(doc(db, "reclamos", reclamo.id), {
      estado: "Respondido",
      respuestas: arrayUnion({
        id: `${reclamo.id}_${Date.now()}`,
        mensaje: texto,
        enviadoPor: usuario.nombre,
        enviadoEn: Timestamp.now(),
      }),
      actualizadoEn: serverTimestamp(),
    });
  } catch {
    throw new Error("El correo fue aceptado para envío, pero no se pudo guardar la respuesta en Firestore. Revisá las reglas antes de volver a enviar para evitar duplicados.");
  }
}
