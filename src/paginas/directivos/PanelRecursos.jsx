import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import StatCard from "../../componentes/StatCard";
import DataTable from "../../componentes/DataTable";
import { escucharHabitaciones } from "../../servicios/internaciones";
import { escucharGuardia } from "../../servicios/guardia";

export default function PanelRecursos() {
  const [habitaciones, setHabitaciones] = useState(null);
  const [pacientesGuardia, setPacientesGuardia] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(
    () => escucharHabitaciones(setHabitaciones, (error) =>
      setErrores((actuales) => ({ ...actuales, camas: error.message }))
    ),
    []
  );
  useEffect(
    () => escucharGuardia(setPacientesGuardia, (error) =>
      setErrores((actuales) => ({ ...actuales, guardia: error.message }))
    ),
    []
  );

  const ocupacion = habitaciones
    ? Object.values(
        habitaciones.reduce((sectores, habitacion) => {
          const sector = habitacion.sector || "Sin sector";
          const fila = sectores[sector] || {
            id: sector,
            sector,
            ocupadas: 0,
            total: 0,
          };
          const capacidad = Math.max(0, Number(habitacion.capacidad) || 0);
          if (habitacion.estado !== "mantenimiento") fila.total += capacidad;
          if (habitacion.estado === "ocupada") fila.ocupadas += 1;
          sectores[sector] = fila;
          return sectores;
        }, {})
      ).map((fila) => ({
        ...fila,
        ocupacion: fila.total
          ? `${Math.round((fila.ocupadas / fila.total) * 100)}%`
          : "—",
      }))
    : [];
  const camasOcupadas = ocupacion.reduce((total, sector) => total + sector.ocupadas, 0);
  const camasDisponibles = ocupacion.reduce((total, sector) => total + sector.total, 0);
  const porcentajeOcupacion = camasDisponibles
    ? `${Math.round((camasOcupadas / camasDisponibles) * 100)}%`
    : "0%";
  const enEspera = pacientesGuardia?.filter((p) => p.estado === "En espera").length ?? 0;
  const enAtencion = pacientesGuardia?.filter((p) => p.estado === "En atención").length ?? 0;
  const atendidos = pacientesGuardia?.filter((p) => p.estado === "Atendido").length ?? 0;

  return (
    <div>
      <PageHeader
        title="Recursos del hospital"
        subtitle="Ocupación de camas por sector y actividad de guardia, actualizadas desde Firestore."
      />

      {Object.entries(errores).map(([fuente, mensaje]) => (
        <div className="alert alert-danger" key={fuente}>
          No se pudieron cargar los datos de {fuente === "camas" ? "camas" : "guardia"}: {mensaje}
        </div>
      ))}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard
            label="Ocupación de camas"
            value={habitaciones ? porcentajeOcupacion : "Cargando…"}
            hint={habitaciones ? `${camasOcupadas} ocupadas de ${camasDisponibles} camas habilitadas` : ""}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Pacientes en guardia"
            value={pacientesGuardia ? enEspera + enAtencion : "Cargando…"}
            hint={pacientesGuardia ? `${enEspera} en espera · ${enAtencion} en atención` : ""}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Pacientes atendidos"
            value={pacientesGuardia ? atendidos : "Cargando…"}
            hint="Histórico de guardia registrado"
          />
        </div>
      </div>

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Ocupación por sector</h2>
      {habitaciones ? (
        <DataTable
          columns={[
            { key: "sector", label: "Sector" },
            { key: "ocupadas", label: "Camas ocupadas" },
            { key: "total", label: "Camas habilitadas" },
            { key: "ocupacion", label: "Ocupación" },
          ]}
          rows={ocupacion}
        />
      ) : (
        <p className="text-muted">Cargando ocupación…</p>
      )}
    </div>
  );
}
