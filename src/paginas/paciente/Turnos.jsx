import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";

const turnos = [
  { id: 1, fecha: "05/10/2026", hora: "09:30", especialidad: "Cardiología", medico: "Dr. Ibarra", estado: "Confirmado" },
  { id: 2, fecha: "18/10/2026", hora: "14:00", especialidad: "Clínica médica", medico: "Dra. Fernández", estado: "Pendiente" },
  { id: 3, fecha: "22/09/2026", hora: "11:15", especialidad: "Pediatría", medico: "Dra. Salas", estado: "Atendido" },
];

export default function Turnos() {
  return (
    <div>
      <PageHeader
        title="Turnos"
        subtitle="Reservá un turno o consultá el estado de los que ya tenés."
        actions={
          <button className="btn btn-dusty" type="button">
            + Reservar turno
          </button>
        }
      />

      <div className="panel-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-sm-4">
            <label className="form-label">Especialidad</label>
            <select className="form-select">
              <option>Todas</option>
              <option>Cardiología</option>
              <option>Clínica médica</option>
              <option>Pediatría</option>
              <option>Traumatología</option>
            </select>
          </div>
          <div className="col-sm-4">
            <label className="form-label">Médico</label>
            <select className="form-select">
              <option>Todos</option>
              <option>Dr. Ibarra</option>
              <option>Dra. Fernández</option>
              <option>Dra. Salas</option>
            </select>
          </div>
          <div className="col-sm-4">
            <button className="btn btn-outline-midnight w-100" type="button">
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "hora", label: "Hora" },
          { key: "especialidad", label: "Especialidad" },
          { key: "medico", label: "Médico" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={turnos}
      />
    </div>
  );
}
