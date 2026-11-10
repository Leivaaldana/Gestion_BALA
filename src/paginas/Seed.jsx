import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { USUARIOS_INICIALES } from "../datos/usuarios";
import { MEDICAMENTOS } from "../datos/medicamentos";
import { HABITACIONES } from "../datos/habitaciones";

export default function Seed() {
  const [log, setLog] = useState([]);

  const sembrarHabitaciones = async () => {
  const out = [];
  for (const { id, ...h } of HABITACIONES) {
    try {
      await setDoc(doc(db, "habitaciones", id), h);
      out.push(`✔ Hab. ${h.numero}`);
    } catch (e) {
      out.push(`✖ Hab. ${h.numero}: ${e.code || e.message}`);
    }
    setLog([...out]);
  }
};

  const sembrarMedicamentos = async () => {
  const out = [];
  for (const { id, ...m } of MEDICAMENTOS) {
    try {
      await setDoc(doc(db, "medicamentos", id), m);
      out.push(`✔ ${m.nombre}`);
    } catch (e) {
      out.push(`✖ ${m.nombre}: ${e.code || e.message}`);
    }
    setLog([...out]);
  }
};

  const sembrar = async () => {
  const out = [];
  for (const u of USUARIOS_INICIALES) {
    try {
      try {
        await createUserWithEmailAndPassword(auth, `${u.dni}@bala.app`, u.contrasena);
      } catch (e) {
        if (e.code !== "auth/email-already-in-use") throw e;
      }
      const { id, contrasena, ...perfil } = u;
      await setDoc(doc(db, "usuarios", u.dni), perfil, { merge: true });
      out.push(`✔ ${u.rol} (${u.dni})`);
    } catch (e) {
      out.push(`✖ ${u.rol} (${u.dni}): ${e.code || e.message}`);
    }
    setLog([...out]);
  }
  await signOut(auth);
};

  return (
    <div className="container py-5">
      <h1>Sembrar usuarios de prueba</h1>
      <button className="btn btn-dusty my-3" onClick={sembrar}>Crear usuarios</button>
      <button className="btn btn-outline-midnight my-3 ms-2" onClick={sembrarHabitaciones}>
          Cargar habitaciones
      </button>
        <button className="btn btn-outline-midnight my-3 ms-2" onClick={sembrarMedicamentos}>
            Cargar medicamentos
        </button>   
      <pre>{log.join("\n")}</pre>
    </div>
  );
}