import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const guardias = [
  { id: 1, dia: "Lunes 05/10", turno: "Mañana", consultorio: "Consultorio 3", estado: "Confirmado" },
  { id: 2, dia: "Miércoles 07/10", turno: "Tarde", consultorio: "Consultorio 1", estado: "Confirmado" },
  { id: 3, dia: "Viernes 09/10", turno: "Noche", consultorio: "Guardia", estado: "Pendiente" },
];

export default function ControlGuardias() {
  return (
    <div>
      <PageHeader
        title="Control de guardias"
        subtitle="Tu calendario personal de jornadas, guardias asignadas y turnos reservados."
      />
      <DataTable
        columns={[
          { key: "dia", label: "Día" },
          { key: "turno", label: "Turno" },
          { key: "consultorio", label: "Consultorio / Sector" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={guardias}
      />
    </div>
  );
}
