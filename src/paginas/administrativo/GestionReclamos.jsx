import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { escucharReclamos, responderReclamo } from "../../servicios/reclamos";

const fechaLegible = (fecha) => {
  if (!fecha) return "Registrando…";
  const date = typeof fecha.toDate === "function" ? fecha.toDate() : new Date(fecha);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("es-AR");
};

export default function GestionReclamos() {
  const { user } = useAuth();
  const [reclamos, setReclamos] = useState(null);
  const [seleccionadoId, setSeleccionadoId] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(
    () =>
      escucharReclamos(
        setReclamos,
        (e) => setError(`No se pudieron cargar los reclamos: ${e.message}`)
      ),
    []
  );

  const seleccionado = reclamos?.find((reclamo) => reclamo.id === seleccionadoId);

  const enviarRespuesta = async (e) => {
    e.preventDefault();
    if (!seleccionado || !respuesta.trim()) return;

    setError("");
    setAviso("");
    setEnviando(true);
    try {
      await responderReclamo(seleccionado, respuesta, user);
      setRespuesta("");
      setAviso(`EmailJS aceptó la respuesta para ${seleccionado.email} y quedó registrada en el reclamo.`);
    } catch (e) {
      setError(e.message || "No se pudo completar el envío de la respuesta.");
    } finally {
      setEnviando(false);
    }
  };

  const filas = (reclamos || []).map((reclamo) => ({
    ...reclamo,
    fecha: fechaLegible(reclamo.creadoEn),
  }));

  return (
    <div>
      <PageHeader
        title="Gestión de reclamos"
        subtitle="Consultas y reclamos recibidos desde Contacto. Las respuestas se envían al correo indicado."
      />

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {aviso && <div className="alert alert-success" role="status">{aviso}</div>}

      {reclamos === null ? (
        <p className="text-muted">Cargando reclamos…</p>
      ) : (
        <DataTable
          columns={[
            { key: "fecha", label: "Recibido" },
            { key: "nombre", label: "Nombre" },
            { key: "email", label: "Correo" },
            { key: "asunto", label: "Asunto" },
            { key: "estado", label: "Estado", estado: true },
          ]}
          rows={filas}
          renderActions={(reclamo) => (
            <button
              className="btn btn-sm btn-dusty"
              type="button"
              onClick={() => {
                setSeleccionadoId(reclamo.id);
                setRespuesta("");
                setAviso("");
              }}
            >
              Ver / responder
            </button>
          )}
        />
      )}

      {seleccionado && (
        <section className="panel-card mt-4" aria-labelledby="detalle-reclamo">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h2 className="h5 mb-1" id="detalle-reclamo">{seleccionado.asunto}</h2>
              <p className="text-muted mb-0">
                {seleccionado.nombre} ·{" "}
                <a href={`mailto:${seleccionado.email}`}>{seleccionado.email}</a>
                {" · "}{fechaLegible(seleccionado.creadoEn)}
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline-midnight"
              type="button"
              onClick={() => setSeleccionadoId("")}
            >
              Cerrar
            </button>
          </div>

          <div className="p-3 mb-4 rounded bg-light" style={{ whiteSpace: "pre-wrap" }}>
            {seleccionado.mensaje}
          </div>

          {seleccionado.respuestas?.length > 0 && (
            <div className="mb-4">
              <h3 className="h6">Respuestas anteriores</h3>
              {seleccionado.respuestas.map((item) => (
                <div className="border rounded p-3 mb-2" key={item.id}>
                  <p className="mb-1" style={{ whiteSpace: "pre-wrap" }}>{item.mensaje}</p>
                  <small className="text-muted">
                    {item.enviadoPor} · {fechaLegible(item.enviadoEn)}
                  </small>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={enviarRespuesta}>
            <label className="form-label" htmlFor="respuesta-reclamo">Responder por correo</label>
            <textarea
              className="form-control mb-3"
              id="respuesta-reclamo"
              rows="5"
              maxLength={5000}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              required
            />
            <button className="btn btn-dusty" type="submit" disabled={enviando || !respuesta.trim()}>
              {enviando ? "Enviando…" : "Enviar respuesta por email"}
            </button>
            <small className="d-block text-muted mt-2">
              El correo se envía mediante el servicio EmailJS conectado al Gmail institucional.
            </small>
          </form>
        </section>
      )}
    </div>
  );
}
