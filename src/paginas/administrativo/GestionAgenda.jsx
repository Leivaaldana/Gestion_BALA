import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { escucharTurnos, cambiarEstadoTurno, formatearFecha } from "../../servicios/turnos";

export default function GestionAgenda() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => escucharTurnos(setTurnos), []);

  const filas = turnos.map((t) => ({ ...t, fecha: formatearFecha(t.fecha) }));

  return (
    <div>
      <PageHeader
        title="Gestión de agenda"
        subtitle="Todos los turnos de la clínica en tiempo real. Confirmá o cancelá."
      />
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "hora", label: "Hora" },
          { key: "especialidad", label: "Especialidad" },
          { key: "medicoNombre", label: "Médico" },
          { key: "pacienteNombre", label: "Paciente" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={filas}
        renderActions={(row) => (
          <div className="d-flex gap-2 justify-content-end">
            {row.estado === "Pendiente" && (
              <button className="btn btn-sm btn-dusty" onClick={() => cambiarEstadoTurno(row.id, "Confirmado")}>
                Confirmar
              </button>
            )}
            {(row.estado === "Pendiente" || row.estado === "Confirmado") && (
              <button className="btn btn-sm btn-outline-midnight" onClick={() => cambiarEstadoTurno(row.id, "Cancelado")}>
                Cancelar
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}