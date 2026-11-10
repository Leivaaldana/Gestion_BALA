import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { formatearFecha } from "../../servicios/turnos";
import { HISTORIAL_VACIO, escucharHistorial, escucharConsultas } from "../../servicios/historias";

export default function MiHistorialClinico() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState(HISTORIAL_VACIO);
  const [consultas, setConsultas] = useState([]);

  useEffect(() => escucharHistorial(user.dni, setHistorial), [user.dni]);
  useEffect(() => escucharConsultas(user.dni, setConsultas), [user.dni]);

  const filas = consultas.map((c) => ({ ...c, fecha: formatearFecha(c.fecha) }));

  return (
    <div>
      <PageHeader
        title="Mi historial clínico"
        subtitle="Diagnósticos, tratamientos y antecedentes registrados por el equipo médico."
      />

      <div className="panel-card mb-4">
        <div className="row g-3">
          <div className="col-sm-4">
            <p className="stat-label mb-1">Grupo sanguíneo</p>
            <p className="fw-semibold mb-0">{historial.grupoSanguineo || "Sin dato"}</p>
          </div>
          <div className="col-sm-4">
            <p className="stat-label mb-1">Alergias</p>
            <p className="fw-semibold mb-0">{historial.alergias}</p>
          </div>
          <div className="col-sm-4">
            <p className="stat-label mb-1">Medicación habitual</p>
            <p className="fw-semibold mb-0">{historial.medicacionHabitual}</p>
          </div>
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Consultas anteriores</h2>
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "motivo", label: "Motivo" },
          { key: "diagnostico", label: "Diagnóstico" },
          { key: "indicaciones", label: "Indicaciones" },
          { key: "medicoNombre", label: "Médico" },
        ]}
        rows={filas}
      />
    </div>
  );
}