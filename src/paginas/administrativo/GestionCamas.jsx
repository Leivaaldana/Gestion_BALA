import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { registrarAuditoria } from "../../servicios/historias";
import {
  ErrorCama, escucharHabitaciones, escucharOrdenes, asignarCama, darAlta,
} from "../../servicios/internaciones";

const ESTADO_LABEL = {
  disponible: "Disponible",
  ocupada: "Ocupada",
  mantenimiento: "Mantenimiento",
  reservada: "Reservada",
};
const BADGE = {
  disponible: "badge-success",
  ocupada: "badge-danger",
  reservada: "badge-warning",
  mantenimiento: "badge-muted",
};

export default function GestionCamas() {
  const { user } = useAuth();
  const [habitaciones, setHabitaciones] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [elegida, setElegida] = useState(null); // orden seleccionada
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => escucharHabitaciones(setHabitaciones), []);
  useEffect(() => escucharOrdenes(setOrdenes), []);

  const pendientes = ordenes.filter((o) => o.tipo === "Internación" && o.estado === "Pendiente");

  // si la orden elegida ya no está pendiente (la tomó otro), se limpia
  useEffect(() => {
    if (elegida && !pendientes.some((o) => o.id === elegida.id)) setElegida(null);
  }, [ordenes]); // eslint-disable-line react-hooks/exhaustive-deps

  const libres = habitaciones.filter((h) => h.estado === "disponible").length;

  const asignar = async (h) => {
    setError(""); setAviso("");
    try {
      await asignarCama(elegida, h);
      registrarAuditoria(user, "Asignó cama", `Paciente #${elegida.pacienteDni} · Hab. ${h.numero}`);
      setAviso(`${elegida.pacienteNombre} quedó internado en la habitación ${h.numero}.`);
      setElegida(null);
    } catch (e) {
      setError(e instanceof ErrorCama ? e.message : "No se pudo asignar la cama.");
    }
  };

  const alta = async (h) => {
    setError(""); setAviso("");
    try {
      await darAlta(h);
      registrarAuditoria(user, "Dio de alta de internación", `Paciente #${h.pacienteDni} · Hab. ${h.numero}`);
      setAviso(`Habitación ${h.numero} liberada.`);
    } catch (e) {
      setError(e instanceof ErrorCama ? e.message : "No se pudo dar el alta.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Gestión de camas e internaciones"
        subtitle="Monitoreá las habitaciones ocupadas y libres por piso, y asigná camas."
      />

      {error && <div className="alert alert-danger">{error}</div>}
      {aviso && <div className="alert alert-success">{aviso}</div>}

      <h2>Órdenes de internación pendientes</h2>
      <DataTable
        columns={[
          { key: "pacienteNombre", label: "Paciente" },
          { key: "sector", label: "Sector pedido" },
          { key: "prioridad", label: "Prioridad", estado: true },
          { key: "motivo", label: "Motivo" },
          { key: "medicoNombre", label: "Médico" },
        ]}
        rows={pendientes}
        renderActions={(row) =>
          elegida?.id === row.id ? (
            <button className="btn btn-sm btn-outline-midnight" onClick={() => setElegida(null)}>
              Cancelar
            </button>
          ) : (
            <button className="btn btn-sm btn-dusty" onClick={() => setElegida(row)}>
              Elegir
            </button>
          )
        }
      />

      <h2>Habitaciones ({libres} libres)</h2>
      {elegida && (
        <div className="alert alert-warning">
          Asignando cama para <strong>{elegida.pacienteNombre}</strong> (sector pedido: {elegida.sector}).
          Elegí una habitación disponible.
        </div>
      )}

      <div className="room-grid">
        {habitaciones.map((h) => (
          <div key={h.id} className={`room-card estado-${h.estado}`}>
            <h3>Hab. {h.numero}</h3>
            <p>
              Piso {h.piso} · {h.sector}
              <br />
              {h.tipo}
            </p>
            <span className={`badge-estado ${BADGE[h.estado]}`}>{ESTADO_LABEL[h.estado]}</span>

            {h.estado === "ocupada" && (
              <>
                <p className="mt-2 mb-2">{h.pacienteNombre}</p>
                <button className="btn btn-sm btn-outline-midnight" onClick={() => alta(h)}>
                  Dar de alta
                </button>
              </>
            )}

            {h.estado === "disponible" && elegida && (
              <div className="mt-2">
                <button className="btn btn-sm btn-dusty w-100" onClick={() => asignar(h)}>
                  Asignar
                </button>
                {h.sector !== elegida.sector && (
                  <p className="mt-2 mb-0">Otro sector</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}