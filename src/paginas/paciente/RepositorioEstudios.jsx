import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const estudios = [
  { id: 1, tipo: "Laboratorio", solicitud: "01/09/2026", realizacion: "03/09/2026", estado: "Realizado" },
  { id: 2, tipo: "Radiografía", solicitud: "15/09/2026", realizacion: "—", estado: "En proceso" },
  { id: 3, tipo: "Ecografía", solicitud: "20/09/2026", realizacion: "—", estado: "Solicitado" },
];

export default function RepositorioEstudios() {
  return (
    <div>
      <PageHeader
        title="Repositorio de estudios"
        subtitle="Resultados de análisis clínicos, radiografías e informes del laboratorio."
      />

      <DataTable
        columns={[
          { key: "tipo", label: "Tipo de estudio" },
          { key: "solicitud", label: "Fecha de solicitud" },
          { key: "realizacion", label: "Fecha de realización" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={estudios}
        renderActions={(row) => (
          <button
            className="btn btn-sm btn-outline-midnight"
            disabled={row.estado !== "Realizado"}
          >
            Descargar
          </button>
        )}
      />
    </div>
  );
}
