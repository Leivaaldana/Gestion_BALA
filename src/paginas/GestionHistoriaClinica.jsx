import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const consultas = [
  { id: 1, fecha: "12/03/2026", motivo: "Control anual", diagnostico: "Sin hallazgos relevantes" },
  { id: 2, fecha: "02/08/2025", motivo: "Dolor abdominal", diagnostico: "Gastritis leve" },
];

export default function GestionHistoriaClinica() {
  return (
    <div>
      <PageHeader
        title="Gestión de historia clínica"
        subtitle="Buscá un paciente por DNI para ver su historial y registrar una nueva evolución."
      />

      <div className="panel-card mb-4">
        <label className="form-label">Buscar paciente por DNI</label>
        <div className="d-flex gap-2">
          <input type="text" className="form-control" placeholder="Ej: 30123456" inputMode="numeric" />
          <button className="btn btn-dusty" type="button">
            Buscar
          </button>
        </div>
      </div>

      <div className="panel-card mb-4">
        <div className="row g-3">
          <div className="col-sm-4">
            <p className="stat-label mb-1">Paciente</p>
            <p className="fw-semibold mb-0">Juana Martínez (DNI 30123456)</p>
          </div>
          <div className="col-sm-4">
            <p className="stat-label mb-1">Grupo sanguíneo</p>
            <p className="fw-semibold mb-0">O+</p>
          </div>
          <div className="col-sm-4">
            <p className="stat-label mb-1">Alergias</p>
            <p className="fw-semibold mb-0">Penicilina</p>
          </div>
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Consultas anteriores</h2>
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "motivo", label: "Motivo" },
          { key: "diagnostico", label: "Diagnóstico" },
        ]}
        rows={consultas}
      />

      <h2 className="h5 mt-4 mb-3" style={{ color: "var(--midnight)" }}>
        Registrar nueva evolución
      </h2>
      <div className="panel-card">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Motivo de consulta</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Diagnóstico</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-12">
            <label className="form-label">Indicaciones</label>
            <textarea className="form-control" rows="3" />
          </div>
          <div className="col-12">
            <button className="btn btn-dusty" type="button">
              Guardar evolución
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}