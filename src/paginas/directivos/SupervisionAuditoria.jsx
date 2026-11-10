import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { escucharAuditoria } from "../../servicios/historias";

export default function SupervisionAuditoria() {
  const [registros, setRegistros] = useState([]);
  const [texto, setTexto] = useState("");
  const [accion, setAccion] = useState("");

  useEffect(() => escucharAuditoria(setRegistros), []);

  const acciones = [...new Set(registros.map((r) => r.accion))];

  const filas = registros
    .map((r) => ({
      ...r,
      fecha: r.creadoEn ? r.creadoEn.toDate().toLocaleString("es-AR") : "Registrando…",
      usuario: `${r.usuarioNombre} (${r.rol})`,
    }))
    .filter((r) => !accion || r.accion === accion)
    .filter((r) =>
      `${r.usuario} ${r.accion} ${r.entidad} ${r.usuarioDni}`
        .toLowerCase()
        .includes(texto.trim().toLowerCase())
    );

  return (
    <div>
      <PageHeader
        title="Supervisión de auditoría"
        subtitle="Registro de quién consultó o modificó la historia clínica de un paciente, y cuándo."
      />

      <div className="panel-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Buscar</label>
            <input
              type="text"
              className="form-control"
              placeholder="DNI del paciente, profesional o acción…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Tipo de acción</label>
            <select className="form-select" value={accion} onChange={(e) => setAccion(e.target.value)}>
              <option value="">Todas</option>
              {acciones.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-midnight w-100"
              type="button"
              onClick={() => { setTexto(""); setAccion(""); }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "fecha", label: "Fecha y hora" },
          { key: "usuario", label: "Usuario" },
          { key: "accion", label: "Acción" },
          { key: "entidad", label: "Entidad afectada" },
        ]}
        rows={filas}
      />
    </div>
  );
}