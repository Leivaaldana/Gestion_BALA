import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { escucharTurnos, cambiarEstadoTurno, formatearFecha } from "../../servicios/turnos";
import { escucharGuardia, cambiarEstadoGuardia } from "../../servicios/guardia";
import { registrarAuditoria } from "../../servicios/historias";

const guardias = [
  { id: 1, dia: "Lunes 05/10", turno: "Mañana", consultorio: "Consultorio 3", estado: "Confirmado" },
  { id: 2, dia: "Miércoles 07/10", turno: "Tarde", consultorio: "Consultorio 1", estado: "Confirmado" },
  { id: 3, dia: "Viernes 09/10", turno: "Noche", consultorio: "Guardia", estado: "Pendiente" },
];

export default function ControlGuardias() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [cola, setCola] = useState([]);

  useEffect(
    () => escucharTurnos(setTurnos, [
      { campo: "medicoDni", valor: user.dni },
      { campo: "medicoEmail", valor: user.email },
    ]),
    [user.dni, user.email]
  );
  useEffect(() => escucharGuardia(setCola), []);

  const filas = turnos.map((t) => ({ ...t, fecha: formatearFecha(t.fecha) }));

  const colaFilas = cola
    .filter((g) => g.estado === "En espera" || (g.estado === "En atención" && g.atendidoPorDni === user.dni))
    .map((g) => ({ ...g, paciente: `${g.nombre} ${g.apellido}` }));

  const atender = async (g) => {
    await cambiarEstadoGuardia(g.id, "En atención", { atendidoPor: user.nombre, atendidoPorDni: user.dni });
    registrarAuditoria(user, "Tomó paciente de guardia", `Paciente #${g.dni}`);
  };

  return (
    <div>
      <PageHeader
        title="Control de guardias"
        subtitle="Tu calendario personal de jornadas, guardias asignadas y turnos reservados."
      />

      <h2>Cola de guardia</h2>
      <DataTable
        columns={[
          { key: "paciente", label: "Paciente" },
          { key: "dni", label: "DNI" },
          { key: "sintomas", label: "Síntomas" },
          { key: "prioridad", label: "Prioridad", estado: true },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={colaFilas}
        renderActions={(row) =>
          row.estado === "En espera" ? (
            <button className="btn btn-sm btn-dusty" onClick={() => atender(row)}>Atender</button>
          ) : (
            <button className="btn btn-sm btn-outline-midnight"
              onClick={() => cambiarEstadoGuardia(row.id, "Atendido")}>Finalizar</button>
          )
        }
      />

      <h2>Guardias asignadas</h2>
      <DataTable
        columns={[
          { key: "dia", label: "Día" },
          { key: "turno", label: "Turno" },
          { key: "consultorio", label: "Consultorio / Sector" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={guardias}
      />

      <h2>Turnos reservados</h2>
      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "hora", label: "Hora" },
          { key: "pacienteNombre", label: "Paciente" },
          { key: "motivo", label: "Motivo" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={filas}
        renderActions={(row) =>
          (row.estado === "Pendiente" || row.estado === "Confirmado") && (
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-sm btn-dusty" onClick={() => cambiarEstadoTurno(row.id, "Atendido")}>Atendido</button>
              <button className="btn btn-sm btn-outline-midnight" onClick={() => cambiarEstadoTurno(row.id, "Ausente")}>Ausente</button>
            </div>
          )
        }
      />
    </div>
  );
}