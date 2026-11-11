import { useEffect, useRef, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { escucharTurnos, cambiarEstadoTurno, formatearFecha, sincronizarDisponibilidad } from "../../servicios/turnos";

export default function GestionAgenda() {
  const [turnos, setTurnos] = useState([]);
  const [errorMigracion, setErrorMigracion] = useState("");
  const migracionIniciada = useRef(false);

  const migrarDisponibilidad = async (lista) => {
    try {
      await sincronizarDisponibilidad(lista);
      setErrorMigracion("");
    } catch (error) {
      console.error("No se pudo sincronizar la disponibilidad de turnos existentes:", error);
      setErrorMigracion("No se pudo preparar la disponibilidad de turnos existentes. Revisá las reglas de Firestore e intentá de nuevo.");
    }
  };

  useEffect(() => escucharTurnos((lista) => {
    setTurnos(lista);
    if (migracionIniciada.current) return;
    migracionIniciada.current = true;
    migrarDisponibilidad(lista);
  }), []);

  const filas = turnos.map((t) => ({ ...t, fecha: formatearFecha(t.fecha) }));

  return (
    <div>
      <PageHeader
        title="Gestión de agenda"
        subtitle="Todos los turnos de la clínica en tiempo real. Confirmá o cancelá."
      />
      {errorMigracion && (
        <div className="alert alert-danger" role="alert">
          {errorMigracion}{" "}
          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => migrarDisponibilidad(turnos)}>
            Reintentar
          </button>
        </div>
      )}
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