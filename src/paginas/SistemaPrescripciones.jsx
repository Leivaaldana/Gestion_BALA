import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const medicamentos = [
  { id: 1, nombre: "Ibuprofeno", principio: "Ibuprofeno", presentacion: "Comprimidos", stock: 120 },
  { id: 2, nombre: "Amoxicilina", principio: "Amoxicilina", presentacion: "Jarabe", stock: 8 },
  { id: 3, nombre: "Suero fisiológico", principio: "Cloruro de sodio", presentacion: "Inyectable", stock: 45 },
];

export default function SistemaPrescripciones() {
  return (
    <div>
      <PageHeader
        title="Sistema de prescripciones"
        subtitle="Fármacos disponibles para reservar y que el paciente pueda retirar."
      />
      <DataTable
        columns={[
          { key: "nombre", label: "Medicamento" },
          { key: "principio", label: "Principio activo" },
          { key: "presentacion", label: "Presentación" },
          { key: "stock", label: "Stock" },
        ]}
        rows={medicamentos}
        renderActions={(row) => (
          <button className="btn btn-sm btn-dusty" disabled={row.stock < 10}>
            Reservar
          </button>
        )}
      />
    </div>
  );
}
