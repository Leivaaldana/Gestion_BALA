import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import StatCard from "../../componentes/StatCard";
import DataTable from "../../componentes/DataTable";
import { escucharTurnos } from "../../servicios/turnos";
import {
  contarPacientesRegistrados, escucharPacientesActivos,
} from "../../servicios/presencia";

export default function AnalisisDatos() {
  const [turnos, setTurnos] = useState(null);
  const [pacientesRegistrados, setPacientesRegistrados] = useState(null);
  const [pacientesActivos, setPacientesActivos] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const cancelarTurnos = escucharTurnos(setTurnos, undefined, (e) =>
      setErrores((actuales) => ({ ...actuales, turnos: e.message }))
    );
    const cancelarPresencia = escucharPacientesActivos(setPacientesActivos, (e) =>
      setErrores((actuales) => ({ ...actuales, activos: e.message }))
    );
    contarPacientesRegistrados()
      .then(setPacientesRegistrados)
      .catch((e) => setErrores((actuales) => ({ ...actuales, registrados: e.message })));

    return () => {
      cancelarTurnos();
      cancelarPresencia();
    };
  }, []);

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

      {Object.entries(errores).map(([fuente, mensaje]) => (
        <div className="alert alert-danger" key={fuente}>
          No se pudieron cargar {
            {
              turnos: "los turnos",
              activos: "la actividad de pacientes",
              registrados: "el conteo de pacientes registrados",
            }[fuente]
          }: {mensaje}
        </div>
      ))}

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
        <div className="col-md-4">
          <StatCard
            label="Pacientes registrados"
            value={pacientesRegistrados === null ? "Cargando…" : formatoNumero(pacientesRegistrados)}
            hint="Perfiles con rol paciente"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Pacientes activos ahora"
            value={pacientesActivos === null ? "Cargando…" : formatoNumero(pacientesActivos)}
            hint="Actividad registrada en los últimos 2 minutos"
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
