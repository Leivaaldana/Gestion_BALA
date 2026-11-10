import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import StatCard from "../../componentes/StatCard";
import DataTable from "../../componentes/DataTable";
import { escucharTurnos } from "../../servicios/turnos";

export default function AnalisisDatos() {
  const [turnos, setTurnos] = useState(null);
  const [error, setError] = useState("");

  useEffect(
    () => escucharTurnos(setTurnos, undefined, (e) => setError(e.message)),
    []
  );

  const porEspecialidad = turnos
    ? Object.values(
        turnos.reduce((especialidades, turno) => {
          const especialidad = turno.especialidad || "Sin especialidad";
          const fila = especialidades[especialidad] || {
            id: especialidad,
            especialidad,
            total: 0,
            pendientes: 0,
            confirmados: 0,
            atendidos: 0,
            cancelados: 0,
          };
          fila.total += 1;
          if (turno.estado === "Pendiente") fila.pendientes += 1;
          if (turno.estado === "Confirmado") fila.confirmados += 1;
          if (turno.estado === "Atendido") fila.atendidos += 1;
          if (turno.estado === "Cancelado") fila.cancelados += 1;
          especialidades[especialidad] = fila;
          return especialidades;
        }, {})
      ).sort((a, b) => b.total - a.total || a.especialidad.localeCompare(b.especialidad, "es"))
    : [];
  const cantidadAtendidos = turnos?.filter((turno) => turno.estado === "Atendido").length ?? 0;
  const cantidadCancelados = turnos?.filter((turno) => turno.estado === "Cancelado").length ?? 0;
  const porcentajeCancelados = turnos?.length
    ? `${((cantidadCancelados / turnos.length) * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })}% del total`
    : "0% del total";
  const formatoNumero = (cantidad) => cantidad.toLocaleString("es-AR");

  return (
    <div>
      <PageHeader
        title="Análisis de datos"
        subtitle="Turnos agrupados por especialidad y estado, según los registros de Firestore."
      />

      {error && <div className="alert alert-danger">No se pudieron cargar los turnos: {error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard
            label="Turnos registrados"
            value={turnos ? formatoNumero(turnos.length) : "Cargando…"}
            hint="Todos los turnos de Firestore"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Turnos atendidos"
            value={turnos ? formatoNumero(cantidadAtendidos) : "Cargando…"}
            hint="Estado Atendido"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Turnos cancelados"
            value={turnos ? formatoNumero(cantidadCancelados) : "Cargando…"}
            hint={turnos ? porcentajeCancelados : ""}
          />
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Turnos por especialidad</h2>
      {turnos ? (
        <DataTable
          columns={[
            { key: "especialidad", label: "Especialidad" },
            { key: "total", label: "Total de turnos" },
            { key: "pendientes", label: "Pendientes" },
            { key: "confirmados", label: "Confirmados" },
            { key: "atendidos", label: "Atendidos" },
            { key: "cancelados", label: "Cancelados" },
          ]}
          rows={porEspecialidad}
        />
      ) : (
        <p className="text-muted">Cargando turnos…</p>
      )}
    </div>
  );
}
