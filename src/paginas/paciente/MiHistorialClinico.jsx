import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const consultas = [
  { id: 1, fecha: "12/03/2026", motivo: "Control anual", diagnostico: "Sin hallazgos relevantes", medico: "Dra. Fernández" },
  { id: 2, fecha: "02/08/2025", motivo: "Dolor abdominal", diagnostico: "Gastritis leve", medico: "Dr. Ibarra" },
  { id: 3, fecha: "20/01/2025", motivo: "Vacunación", diagnostico: "Antigripal aplicada", medico: "Enf. Torres" },
];

export default function MiHistorialClinico() {
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
            <p className="fw-semibold mb-0">O+</p>
          </div>
          <div className="col-sm-4">
            <p className="stat-label mb-1">Alergias</p>
            <p className="fw-semibold mb-0">Penicilina</p>
          </div>
          <div className="col-sm-4">
            <p className="stat-label mb-1">Medicación habitual</p>
            <p className="fw-semibold mb-0">Ninguna</p>
          </div>
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Consultas anteriores</h2>
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "motivo", label: "Motivo" },
          { key: "diagnostico", label: "Diagnóstico" },
          { key: "medico", label: "Médico" },
        ]}
        rows={consultas}
      />
    </div>
  );
}
