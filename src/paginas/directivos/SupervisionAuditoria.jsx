import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const auditoria = [
  { id: 1, fecha: "29/09/2026 09:14", usuario: "Dr. Ibarra", accion: "Consultó historia clínica", entidad: "Paciente #30123456" },
  { id: 2, fecha: "29/09/2026 09:20", usuario: "Enf. Torres", accion: "Modificó indicación", entidad: "Receta #5521" },
  { id: 3, fecha: "28/09/2026 18:02", usuario: "Dra. Fernández", accion: "Consultó historia clínica", entidad: "Paciente #28998211" },
];

export default function SupervisionAuditoria() {
  return (
    <div>
      <PageHeader
        title="Supervisión de auditoría"
        subtitle="Registro de quién consultó o modificó la historia clínica de un paciente, y cuándo."
      />
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha y hora" },
          { key: "usuario", label: "Usuario" },
          { key: "accion", label: "Acción" },
          { key: "entidad", label: "Entidad afectada" },
        ]}
        rows={auditoria}
      />
    </div>
  );
}
