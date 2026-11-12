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
  const [buscando, setBuscando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cargandoConsultas, setCargandoConsultas] = useState(false);
  const [errorConsultas, setErrorConsultas] = useState("");

  useEffect(() => {
    if (!paciente) return;
    setConsultas([]);
    setCargandoConsultas(true);
    setErrorConsultas("");
    return escucharConsultas(
      paciente.dni,
      (lista) => {
        setConsultas(lista);
        setCargandoConsultas(false);
      },
      (e) => {
        console.error("No se pudieron cargar las consultas del paciente:", e);
        setErrorConsultas(e.message);
        setCargandoConsultas(false);
      }
    );
  }, [paciente]);

  const buscar = async () => {
    setError(""); setAviso(""); setPaciente(null);
    if (!/^\d{7,8}$/.test(dni.trim())) {
      setError("El DNI debe tener 7 u 8 números.");
      return;
    }
    setBuscando(true);
    try {
      const p = await buscarPaciente(dni.trim());
      if (!p) {
        setError("No se encontró un paciente con ese DNI.");
        return;
      }
      const historial = await obtenerHistorial(p.dni);
      setDraft(historial);
      setPaciente(p);
      setEvo(EVO_VACIA);
      registrarAuditoria(user, "Consultó historia clínica", `Paciente #${p.dni}`);
    } catch (e) {
      console.error("No se pudo buscar la historia clínica del paciente:", e);
      setError(
        e.code === "permission-denied"
          ? "Firebase denegó el acceso a este paciente o a su historia clínica. Revisá las reglas de las colecciones usuarios e historiales para permitir la consulta a médicos autorizados."
          : `No se pudo buscar al paciente${e.code ? ` (${e.code})` : ""}: ${e.message}`
      );
    } finally {
      setBuscando(false);
    }
  };

  const guardarAntecedentes = async () => {
    setError(""); setAviso(""); setGuardando(true);
    try {
      await guardarHistorial(paciente.dni, draft);
      registrarAuditoria(user, "Modificó antecedentes", `Paciente #${paciente.dni}`);
      setAviso("Antecedentes guardados.");
    } catch (e) {
      console.error("No se pudieron guardar los antecedentes del paciente:", e);
      setError(e.code === "permission-denied"
        ? "Firebase denegó el guardado. Revisá las reglas de la colección historiales para permitir actualizaciones a médicos autorizados."
        : `No se pudieron guardar los antecedentes${e.code ? ` (${e.code})` : ""}: ${e.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const guardarEvolucion = async () => {
    setError(""); setAviso("");
    if (!evo.motivo.trim() || !evo.diagnostico.trim()) {
      setError("Completá el motivo y el diagnóstico.");
      return;
    }
    setGuardando(true);
    try {
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
    } catch (e) {
      console.error("No se pudo registrar la evolución del paciente:", e);
      setError(e.code === "permission-denied"
        ? "Firebase denegó el registro de la evolución. Revisá las reglas de la colección consultas para permitir escrituras a médicos autorizados."
        : `No se pudo registrar la evolución${e.code ? ` (${e.code})` : ""}: ${e.message}`);
    } finally {
      setGuardando(false);
    }
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
          <button className="btn btn-dusty" type="button" onClick={buscar} disabled={buscando}>
            {buscando ? "Buscando…" : "Buscar"}
          </button>
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
                <select className="form-select" value={draft?.grupoSanguineo || ""}
                  onChange={(e) => setDraft({ ...draft, grupoSanguineo: e.target.value })}>
                  {GRUPOS.map((g) => <option key={g} value={g}>{g || "Sin dato"}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Alergias</label>
                <input className="form-control" value={draft?.alergias || ""}
                  onChange={(e) => setDraft({ ...draft, alergias: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Medicación habitual</label>
                <input className="form-control" value={draft?.medicacionHabitual || ""}
                  onChange={(e) => setDraft({ ...draft, medicacionHabitual: e.target.value })} />
              </div>
              <div className="col-12">
                <button className="btn btn-outline-midnight btn-sm" type="button" onClick={guardarAntecedentes} disabled={guardando}>
                  {guardando ? "Guardando…" : "Guardar antecedentes"}
                </button>
              </div>
            </div>
          </div>

          <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Consultas anteriores</h2>
          {errorConsultas && <div className="alert alert-danger">No se pudieron cargar las consultas: {errorConsultas}</div>}
          {cargandoConsultas ? (
            <p className="text-muted">Cargando consultas…</p>
          ) : (
            <DataTable
              columns={[
                { key: "fecha", label: "Fecha" },
                { key: "motivo", label: "Motivo" },
                { key: "diagnostico", label: "Diagnóstico" },
                { key: "medicoNombre", label: "Médico" },
              ]}
              rows={filas}
            />
          )}

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
                <button className="btn btn-dusty" type="button" onClick={guardarEvolucion} disabled={guardando}>
                  {guardando ? "Guardando…" : "Guardar evolución"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}