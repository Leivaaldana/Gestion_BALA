import PageHeader from "../../componentes/PageHeader";
import StatCard from "../../componentes/StatCard";
import DataTable from "../../componentes/DataTable";

const ocupacion = [
  { id: 1, sector: "Internación general", ocupadas: 18, total: 24 },
  { id: 2, sector: "Terapia intensiva", ocupadas: 6, total: 8 },
  { id: 3, sector: "Guardia", ocupadas: 4, total: 10 },
];

export default function PanelRecursos() {
  return (
    <div>
      <PageHeader
        title="Recursos del hospital"
        subtitle="Ocupación de camas, ambulancias activas y médicos en guardia, en tiempo real."
      />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard label="Ocupación de camas" value="76%" hint="38 de 50 camas ocupadas" />
        </div>
        <div className="col-md-4">
          <StatCard label="Ambulancias activas" value="3 / 5" hint="2 disponibles en base" />
        </div>
        <div className="col-md-4">
          <StatCard label="Médicos en guardia" value="12" hint="4 especialidades cubiertas" />
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Ocupación por sector</h2>
      <DataTable
        columns={[
          { key: "sector", label: "Sector" },
          { key: "ocupadas", label: "Camas ocupadas" },
          { key: "total", label: "Total de camas" },
        ]}
        rows={ocupacion}
      />
    </div>
  );
}
