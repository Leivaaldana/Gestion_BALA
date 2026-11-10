import { useEffect, useRef, useState } from "react";
import PageHeader from "../componentes/PageHeader";
import { useAuth } from "../context/AuthContext";
import { comprimirFotoPerfil } from "../servicios/perfil";
import "../estilos/Perfil.css";

const ROLES = {
  paciente: "Paciente",
  medico: "Médico/a",
  enfermera: "Enfermero/a",
  administrativo: "Administrativo",
  directivos: "Directivo/a",
};

export default function Perfil() {
  const { user, actualizarFotoPerfil } = useAuth();
  const inputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(
    () => () => {
      if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    },
    [vistaPrevia]
  );

  const elegirFoto = (e) => {
    const nueva = e.target.files?.[0];
    setError("");
    setAviso("");
    if (!nueva) return;

    setArchivo(nueva);
    setVistaPrevia(URL.createObjectURL(nueva));
  };

  const guardarFoto = async (e) => {
    e.preventDefault();
    if (!archivo) return;

    setError("");
    setAviso("");
    setGuardando(true);
    try {
      const fotoComprimida = await comprimirFotoPerfil(archivo);
      await actualizarFotoPerfil(fotoComprimida);
      setArchivo(null);
      setVistaPrevia("");
      if (inputRef.current) inputRef.current.value = "";
      setAviso("La foto de perfil se guardó correctamente.");
    } catch (e) {
      setError(e.message || "No se pudo guardar la foto.");
    } finally {
      setGuardando(false);
    }
  };

  const iniciales = (user?.nombre || "?")
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const foto = vistaPrevia || user?.fotoPerfil;

  return (
    <div>
      <PageHeader
        title="Mi perfil"
        subtitle="Consultá tus datos personales y actualizá tu foto de perfil."
      />

      <div className="profile-card">
        <section className="profile-photo-section" aria-label="Foto de perfil">
          <div className="profile-photo">
            {foto ? <img src={foto} alt="Foto de perfil" /> : <span>{iniciales}</span>}
          </div>
          <div>
            <h2 className="h5 mb-1">{user?.nombre}</h2>
            <p className="text-muted mb-3">{ROLES[user?.rol] || "Usuario"}</p>
            <form onSubmit={guardarFoto}>
              <label className="form-label" htmlFor="foto-perfil">Cambiar foto</label>
              <input
                ref={inputRef}
                className="form-control mb-2"
                id="foto-perfil"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={elegirFoto}
              />
              <small className="text-muted d-block mb-3">
                JPG, PNG o WebP. Máximo 8 MB antes de comprimir.
              </small>
              <button className="btn btn-dusty" type="submit" disabled={!archivo || guardando}>
                {guardando ? "Guardando…" : "Guardar foto"}
              </button>
            </form>
          </div>
        </section>

        {error && <div className="alert alert-danger mt-4" role="alert">{error}</div>}
        {aviso && <div className="alert alert-success mt-4" role="status">{aviso}</div>}

        <section className="profile-details mt-4" aria-labelledby="datos-personales">
          <h2 className="h5 mb-3" id="datos-personales">Datos personales</h2>
          <dl className="profile-data-grid mb-0">
            <div><dt>Nombre</dt><dd>{user?.nombrePila || "—"}</dd></div>
            <div><dt>Apellido</dt><dd>{user?.apellido || "—"}</dd></div>
            <div><dt>DNI</dt><dd>{user?.dni || "—"}</dd></div>
            <div><dt>Correo electrónico</dt><dd>{user?.email || "—"}</dd></div>
            <div><dt>Rol</dt><dd>{ROLES[user?.rol] || "—"}</dd></div>
            {user?.especialidad && (
              <div><dt>Especialidad</dt><dd>{user.especialidad}</dd></div>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}
