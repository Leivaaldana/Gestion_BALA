import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import BookingProgress from "../../componentes/BookingProgress.jsx";
import { useAuth } from "../../context/AuthContext";
import {
  HORARIOS, hoyISO, formatearFecha, esDiaHabil, listarMedicos,
  horariosOcupados, reservarTurno, escucharTurnos, cambiarEstadoTurno,
} from "../../servicios/turnos";

const FORM_VACIO = { especialidad: "", medicoDni: "", fecha: "", hora: "", motivo: "" };

export default function Turnos() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [flujoReserva, setFlujoReserva] = useState(location.state?.bookingFlow === true);
  const [reservaCompleta, setReservaCompleta] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [abierto, setAbierto] = useState(location.state?.bookingFlow === true);
  const [form, setForm] = useState(FORM_VACIO);
  const [ocupados, setOcupados] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (location.state?.bookingFlow !== true) return;
    setFlujoReserva(true);
    setAbierto(true);
    setReservaCompleta(false);
    setError("");
  }, [location.key, location.state]);

  useEffect(
    () => escucharTurnos(setTurnos, [
      { campo: "pacienteDni", valor: user.dni },
      { campo: "pacienteEmail", valor: user.email },
    ]),
    [user.dni, user.email]
  );
  useEffect(() => {
    listarMedicos().then(setMedicos);
  }, []);
  useEffect(() => {
    if (form.medicoDni && form.fecha) horariosOcupados(form.medicoDni, form.fecha).then(setOcupados);
    else setOcupados([]);
  }, [form.medicoDni, form.fecha]);

  const especialidades = [...new Set(medicos.map((m) => m.especialidad).filter(Boolean))];
  const medicosFiltrados = medicos.filter((m) => m.especialidad === form.especialidad);

  const cambiar = (e) => {
    const { name, value } = e.target;
    if (name === "fecha" && value && !esDiaHabil(value)) {
      setForm((f) => ({ ...f, fecha: "", hora: "" }));
      setOcupados([]);
      setError("La clínica atiende de lunes a viernes. Elegí un día hábil.");
      return;
    }

    setForm((f) => {
      const n = { ...f, [name]: value };
      if (name === "especialidad") { n.medicoDni = ""; n.hora = ""; }
      if (name === "medicoDni" || name === "fecha") n.hora = "";
      return n;
    });
    setError("");
  };

  const reservar = async () => {
    const { especialidad, medicoDni, fecha, hora, motivo } = form;
    if (!especialidad || !medicoDni || !fecha || !hora || !motivo.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    const medico = medicos.find((m) => m.dni === medicoDni);
    setGuardando(true);
    try {
      await reservarTurno({
        pacienteDni: user.dni,
        pacienteNombre: user.nombre,
        pacienteEmail: user.email,
        medicoDni,
        medicoNombre: `${medico.nombre} ${medico.apellido}`,
        medicoEmail: medico.email,
        especialidad,
        fecha,
        hora,
        motivo: motivo.trim(),
      });
      setForm(FORM_VACIO);
      setAbierto(false);
      setFlujoReserva(false);
      setReservaCompleta(true);
      navigate(location.pathname, { replace: true, state: null });
    } catch (e) {
      if (e.message === "OCUPADO") {
        setError("Ese horario acaba de ser tomado. Elegí otro.");
        horariosOcupados(medicoDni, fecha).then(setOcupados);
      } else if (e.message === "FUERA_DE_HORARIO") {
        setError("Elegí un día de lunes a viernes y un horario entre las 9:00 y las 15:30.");
      } else if (e.code === "permission-denied") {
        console.error("Firebase rechazó la reserva del turno:", e);
        setError("Firebase rechazó la reserva (permission-denied). Revisá las reglas de Firestore para permitir la lectura y creación de turnos a pacientes autenticados.");
      } else if (e.code === "failed-precondition") {
        console.error("Firestore no pudo completar la reserva por una precondición:", e);
        setError(`Firestore no pudo completar la reserva: ${e.message}`);
      } else if (e.code === "unavailable" || e.code === "network-request-failed") {
        console.error("No se pudo conectar con Firestore al reservar el turno:", e);
        setError("No se pudo conectar con Firebase para reservar. Revisá tu conexión e intentá de nuevo.");
      } else {
        console.error("Error al reservar el turno:", e);
        setError(`No se pudo reservar el turno${e.code ? ` (${e.code})` : ""}. Revisá la conexión e intentá de nuevo.`);
      }
    } finally {
      setGuardando(false);
    }
  };

  const filas = turnos.map((t) => ({ ...t, fecha: formatearFecha(t.fecha) }));

  return (
    <div>
      {flujoReserva && (
        <section className="booking-destination" aria-live="polite">
          <div>
            <span className="booking-destination__eyebrow">PASO 3 DE 3</span>
            <h2>Ya estás en el lugar indicado.</h2>
            <p>Completá los datos para encontrar un horario que te quede bien.</p>
          </div>
          <BookingProgress step={3} />
        </section>
      )}
      {reservaCompleta && (
        <section className="booking-destination is-complete" role="status">
          <div>
            <span className="booking-destination__eyebrow">OBJETIVO CUMPLIDO</span>
            <h2>¡Listo! Tu turno quedó reservado.</h2>
            <p>Vas a poder consultar su estado desde esta sección.</p>
          </div>
          <BookingProgress step={3} complete />
        </section>
      )}
      <PageHeader
        title="Turnos"
        subtitle="Reservá un turno o consultá el estado de los que ya tenés."
        actions={
          <button className="btn btn-dusty" type="button" onClick={() => { setAbierto(!abierto); setReservaCompleta(false); }}>
            {abierto ? "Cerrar" : "+ Reservar turno"}
          </button>
        }
      />

      {abierto && (
        <div className="panel-card mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Especialidad</label>
              <select className="form-select" name="especialidad" value={form.especialidad} onChange={cambiar}>
                <option value="">Elegí una…</option>
                {especialidades.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Médico</label>
              <select className="form-select" name="medicoDni" value={form.medicoDni} onChange={cambiar} disabled={!form.especialidad}>
                <option value="">Elegí uno…</option>
                {medicosFiltrados.map((m) => (
                  <option key={m.dni} value={m.dni}>{m.nombre} {m.apellido}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" name="fecha" min={hoyISO()} value={form.fecha} onChange={cambiar} disabled={!form.medicoDni} />
              <small className="form-text">Atención de lunes a viernes.</small>
            </div>
            <div className="col-md-4">
              <label className="form-label">Horario</label>
              <select className="form-select" name="hora" value={form.hora} onChange={cambiar} disabled={!form.fecha}>
                <option value="">Elegí un horario…</option>
                {HORARIOS.filter((h) => !ocupados.includes(h)).map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label">Motivo</label>
              <input type="text" className="form-control" name="motivo" value={form.motivo} onChange={cambiar} placeholder="¿Por qué consultás?" />
            </div>
            {error && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{error}</div></div>}
            <div className="col-12">
              <button className="btn btn-dusty" type="button" onClick={reservar} disabled={guardando}>
                {guardando ? "Reservando…" : "Confirmar reserva"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={[
          { key: "fecha", label: "Fecha" },
          { key: "hora", label: "Hora" },
          { key: "especialidad", label: "Especialidad" },
          { key: "medicoNombre", label: "Médico" },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={filas}
        renderActions={(row) =>
          (row.estado === "Pendiente" || row.estado === "Confirmado") && (
            <button className="btn btn-sm btn-outline-midnight" onClick={() => cambiarEstadoTurno(row.id, "Cancelado")}>
              Cancelar
            </button>
          )
        }
      />
    </div>
  );
}