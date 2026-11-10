import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import {
  HORARIOS, hoyISO, formatearFecha, listarMedicos,
  horariosOcupados, reservarTurno, escucharTurnos, cambiarEstadoTurno,
} from "../../servicios/turnos";

const FORM_VACIO = { especialidad: "", medicoDni: "", fecha: "", hora: "", motivo: "" };

export default function Turnos() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [ocupados, setOcupados] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(
    () => escucharTurnos(setTurnos, { campo: "pacienteDni", valor: user.dni }),
    [user.dni]
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
        medicoDni,
        medicoNombre: `${medico.nombre} ${medico.apellido}`,
        especialidad,
        fecha,
        hora,
        motivo: motivo.trim(),
      });
      setForm(FORM_VACIO);
      setAbierto(false);
    } catch (e) {
      if (e.message === "OCUPADO") {
        setError("Ese horario acaba de ser tomado. Elegí otro.");
        horariosOcupados(medicoDni, fecha).then(setOcupados);
      } else {
        setError("No se pudo reservar el turno. Probá de nuevo.");
      }
    }
    setGuardando(false);
  };

  const filas = turnos.map((t) => ({ ...t, fecha: formatearFecha(t.fecha) }));

  return (
    <div>
      <PageHeader
        title="Turnos"
        subtitle="Reservá un turno o consultá el estado de los que ya tenés."
        actions={
          <button className="btn btn-dusty" type="button" onClick={() => setAbierto(!abierto)}>
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