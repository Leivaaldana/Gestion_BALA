import PageHeader from "../../componentes/PageHeader";
import StatCard from "../../componentes/StatCard";
import DataTable from "../../componentes/DataTable";

const porDepartamento = [
  { id: 1, departamento: "Clínica médica", cantidad: 142 },
  { id: 2, departamento: "Pediatría", cantidad: 98 },
  { id: 3, departamento: "Cardiología", cantidad: 64 },
  { id: 4, departamento: "Traumatología", cantidad: 51 },
];

export default function AnalisisDatos() {
  return (
    <div>
      <PageHeader
        title="Análisis de datos"
        subtitle="Volumen de pacientes atendidos por departamento en el último mes."
      />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard label="Pacientes atendidos" value="355" hint="Últimos 30 días" />
        </div>
        <div className="col-md-4">
          <StatCard label="Turnos cancelados" value="27" hint="7.6% del total" />
        </div>
        <div className="col-md-4">
          <StatCard label="Tiempo promedio de espera" value="18 min" hint="En guardia" />
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Pacientes por departamento</h2>
      <DataTable
        columns={[
          { key: "departamento", label: "Departamento" },
          { key: "cantidad", label: "Pacientes atendidos" },
        ]}
        rows={porDepartamento}
      />
    </div>
  );
}
