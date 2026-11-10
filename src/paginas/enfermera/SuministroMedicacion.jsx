import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { registrarAuditoria } from "../../servicios/historias";
import { escucharIndicaciones, marcarAdministrada } from "../../servicios/prescripciones";

export default function SuministroMedicacion() {
  const { user } = useAuth();
  const [indicaciones, setIndicaciones] = useState([]);

  useEffect(() => escucharIndicaciones(setIndicaciones), []);

  const toggle = async (item) => {
    const nuevo = !item.administrado;
    await marcarAdministrada(item.id, nuevo, user);
    registrarAuditoria(
      user,
      nuevo ? "Administró medicación" : "Revirtió administración",
      `Paciente #${item.pacienteDni}`
    );
  };

  return (
    <div>
      <PageHeader
        title="Suministro de medicación"
        subtitle="Indicaciones médicas por paciente. Marcá cada fármaco como administrado."
      />

      <div className="panel-card">
        {indicaciones.length === 0 && (
          <p className="text-muted mb-0">No hay indicaciones pendientes.</p>
        )}
        {indicaciones.map((item) => (
          <div className="check-row" key={item.id}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`ind-${item.id}`}
                checked={item.administrado}
                onChange={() => toggle(item)}
              />
              <label className="form-check-label" htmlFor={`ind-${item.id}`}>
                <strong>{item.pacienteNombre}</strong> — {item.medicamento} × {item.cantidad}
                <br />
                <small className="text-muted">{item.indicaciones}</small>
                {item.administrado && item.administradoPor && (
                  <small className="text-muted"> · Administró: {item.administradoPor}</small>
                )}
              </label>
            </div>
            <span className={`badge-estado ${item.administrado ? "badge-success" : "badge-warning"}`}>
              {item.administrado ? "Administrado" : "Pendiente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}