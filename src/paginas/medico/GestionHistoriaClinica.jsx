import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { hoyISO, formatearFecha } from "../../servicios/turnos";
import {
  buscarPaciente, obtenerHistorial, guardarHistorial,
  escucharConsultas, registrarConsulta, registrarAuditoria,
} from "../../servicios/historias";

const GRUPOS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const EVO_VACIA = { motivo: "", diagnostico: "", indicaciones: "" };

export default function GestionHistoriaClinica() {
  const { user } = useAuth();
  const [dni, setDni] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [draft, setDraft] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [evo, setEvo] = useState(EVO_VACIA);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (!paciente) return;
    return escucharConsultas(paciente.dni, setConsultas);
  }, [paciente]);

  const buscar = async () => {
    setError(""); setAviso(""); setPaciente(null);
    if (!/^\d{7,8}$/.test(dni.trim())) {
      setError("El DNI debe tener 7 u 8 números.");
      return;
    }
    const p = await buscarPaciente(dni.trim());
    if (!p) {
      setError("No se encontró un paciente con ese DNI.");
      return;
    }
    setDraft(await obtenerHistorial(p.dni));
    setPaciente(p);
    setEvo(EVO_VACIA);
    registrarAuditoria(user, "Consultó historia clínica", `Paciente #${p.dni}`);
  };

  const guardarAntecedentes = async () => {
    await guardarHistorial(paciente.dni, draft);
    registrarAuditoria(user, "Modificó antecedentes", `Paciente #${paciente.dni}`);
    setAviso("Antecedentes guardados.");
  };

  const guardarEvolucion = async () => {
    setError(""); setAviso("");
    if (!evo.motivo.trim() || !evo.diagnostico.trim()) {
      setError("Completá el motivo y el diagnóstico.");
      return;
    }
    await registrarConsulta({
      pacienteDni: paciente.dni,
      pacienteNombre: `${paciente.nombre} ${paciente.apellido}`,
      medicoDni: user.dni,
      medicoNombre: user.nombre,
      fecha: hoyISO(),
      motivo: evo.motivo.trim(),
      diagnostico: evo.diagnostico.trim(),
      indicaciones: evo.indicaciones.trim(),
    });
    registrarAuditoria(user, "Registró evolución", `Paciente #${paciente.dni}`);
    setEvo(EVO_VACIA);
    setAviso("Evolución guardada.");
  };

  const filas = consultas.map((c) => ({ ...c, fecha: formatearFecha(c.fecha) }));

  return (
    <div>
      <PageHeader
        title="Gestión de historia clínica"
        subtitle="Buscá un paciente por DNI para ver su historial y registrar una nueva evolución."
      />

      <div className="panel-card mb-4">
        <label className="form-label">Buscar paciente por DNI</label>
        <div className="d-flex gap-2">
          <input
            type="text" className="form-control" placeholder="Ej: 30111111" inputMode="numeric"
            value={dni} onChange={(e) => setDni(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
          />
          <button className="btn btn-dusty" type="button" onClick={buscar}>Buscar</button>
        </div>
        {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
      </div>

      {paciente && (
        <>
          <div className="panel-card mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <p className="stat-label mb-1">Paciente</p>
                <p className="fw-semibold mb-0">{paciente.nombre} {paciente.apellido} (DNI {paciente.dni})</p>
              </div>
              <div className="col-md-3">
                <label className="form-label">Grupo sanguíneo</label>
                <select className="form-select" value={draft.grupoSanguineo}
                  onChange={(e) => setDraft({ ...draft, grupoSanguineo: e.target.value })}>
                  {GRUPOS.map((g) => <option key={g} value={g}>{g || "Sin dato"}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Alergias</label>
                <input className="form-control" value={draft.alergias}
                  onChange={(e) => setDraft({ ...draft, alergias: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Medicación habitual</label>
                <input className="form-control" value={draft.medicacionHabitual}
                  onChange={(e) => setDraft({ ...draft, medicacionHabitual: e.target.value })} />
              </div>
              <div className="col-12">
                <button className="btn btn-outline-midnight btn-sm" type="button" onClick={guardarAntecedentes}>
                  Guardar antecedentes
                </button>
              </div>
            </div>
          </div>

          <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Consultas anteriores</h2>
          <DataTable
            columns={[
              { key: "fecha", label: "Fecha" },
              { key: "motivo", label: "Motivo" },
              { key: "diagnostico", label: "Diagnóstico" },
              { key: "medicoNombre", label: "Médico" },
            ]}
            rows={filas}
          />

          <h2 className="h5 mt-4 mb-3" style={{ color: "var(--midnight)" }}>Registrar nueva evolución</h2>
          <div className="panel-card">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Motivo de consulta</label>
                <input type="text" className="form-control" value={evo.motivo}
                  onChange={(e) => setEvo({ ...evo, motivo: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Diagnóstico</label>
                <input type="text" className="form-control" value={evo.diagnostico}
                  onChange={(e) => setEvo({ ...evo, diagnostico: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Indicaciones</label>
                <textarea className="form-control" rows="3" value={evo.indicaciones}
                  onChange={(e) => setEvo({ ...evo, indicaciones: e.target.value })} />
              </div>
              {aviso && <div className="col-12"><div className="alert alert-success py-2 mb-0">{aviso}</div></div>}
              <div className="col-12">
                <button className="btn btn-dusty" type="button" onClick={guardarEvolucion}>
                  Guardar evolución
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}