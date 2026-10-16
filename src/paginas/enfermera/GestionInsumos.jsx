import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const insumos = [
  { id: 1, insumo: "Jeringas 5ml", sector: "Guardia", stock: 200, unidad: "unidades" },
  { id: 2, insumo: "Suero fisiológico 500ml", sector: "Internación", stock: 15, unidad: "unidades" },
  { id: 3, insumo: "Gasas estériles", sector: "Quirófano", stock: 60, unidad: "paquetes" },
];

export default function GestionInsumos() {
  return (
    <div>
      <PageHeader
        title="Gestión de insumos rápidos"
        subtitle="Stock local de jeringas, sueros y elementos de curación de tu sector."
      />
      <DataTable
        columns={[
          { key: "insumo", label: "Insumo" },
          { key: "sector", label: "Sector" },
          { key: "stock", label: "Stock" },
          { key: "unidad", label: "Unidad" },
        ]}
        rows={insumos}
        renderActions={() => (
          <button className="btn btn-sm btn-outline-midnight">Descontar</button>
        )}
      />
    </div>
  );
}
