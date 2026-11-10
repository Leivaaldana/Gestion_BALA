import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { USUARIOS_INICIALES } from "../datos/usuarios";

export default function Seed() {
  const [log, setLog] = useState([]);

  const sembrar = async () => {
    const out = [];
    for (const u of USUARIOS_INICIALES) {
      try {
        await createUserWithEmailAndPassword(auth, `${u.dni}@bala.app`, u.contrasena);
        await setDoc(doc(db, "usuarios", u.dni), {
          dni: u.dni, nombre: u.nombre, apellido: u.apellido, email: u.email, rol: u.rol,
        });
        out.push(`✔ ${u.rol} (${u.dni})`);
      } catch (e) {
        out.push(`✖ ${u.rol} (${u.dni}): ${e.code}`);
      }
      setLog([...out]);
    }
    await signOut(auth);
  };

  return (
    <div className="container py-5">
      <h1>Sembrar usuarios de prueba</h1>
      <button className="btn btn-dusty my-3" onClick={sembrar}>Crear usuarios</button>
      <pre>{log.join("\n")}</pre>
    </div>
  );
}