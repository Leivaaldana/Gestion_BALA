import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const agenda = [
  { id: 1, fecha: "05/10/2026", hora: "09:30", medico: "Dr. Ibarra", consultorio: "Consultorio 3", paciente: "Juana Martínez", estado: "Confirmado" },
  { id: 2, fecha: "05/10/2026", hora: "10:00", medico: "Dra. Fernández", consultorio: "Consultorio 1", paciente: "Carlos Gómez", estado: "Pendiente" },
  { id: 3, fecha: "05/10/2026", hora: "10:30", medico: "Dra. Salas", consultorio: "Consultorio 2", paciente: "—", estado: "Cancelado" },
];

export default function GestionAgenda() {
  return (
    <div>
      <PageHeader
        title="Gestión de agenda"
        subtitle="Coordiná horarios, consultorios y turnos de los profesionales médicos."
        actions={
          <button className="btn btn-dusty" type="button">
            + Nuevo turno
          </button>
        }
      />
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "hora", label: "Hora" },
          { key: "medico", label: "Médico" },
          { key: "consultorio", label: "Consultorio" },
          { key: "paciente", label: "Paciente" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={agenda}
      />
    </div>
  );
}
