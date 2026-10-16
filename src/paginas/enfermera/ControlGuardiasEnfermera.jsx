import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const guardias = [
  { id: 1, dia: "Lunes 05/10", turno: "Mañana", sector: "Guardia", estado: "Confirmado" },
  { id: 2, dia: "Martes 06/10", turno: "Tarde", sector: "Internación", estado: "Confirmado" },
  { id: 3, dia: "Jueves 08/10", turno: "Noche", sector: "Terapia intensiva", estado: "Pendiente" },
];

export default function ControlGuardiasEnfermera() {
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
          { key: "sector", label: "Sector" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={guardias}
      />
    </div>
  );
}
