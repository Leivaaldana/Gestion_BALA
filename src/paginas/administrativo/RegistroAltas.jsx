import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { hoyISO } from "../../servicios/turnos";
import { buscarPaciente, registrarAuditoria } from "../../servicios/historias";
import {
  PRIORIDADES, calcularPrioridad, registrarIngreso, escucharGuardia,
} from "../../servicios/guardia";

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const VACIO = { dni: "", nombre: "", apellido: "", fechaNacimiento: "", sintomas: "" };

export default function RegistroAltas() {
  const { user } = useAuth();
  const [form, setForm] = useState(VACIO);
  const [prioridad, setPrioridad] = useState("Baja");
  const [manual, setManual] = useState(false); // si el recepcionista tocó la prioridad
  const [cola, setCola] = useState([]);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => escucharGuardia(setCola), []);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "sintomas" && !manual) setPrioridad(calcularPrioridad(value));
    setError(""); setAviso("");
  };

  // Si el DNI ya es de un paciente registrado, completa nombre y apellido
  const completarPorDni = async () => {
    if (!/^\d{7,8}$/.test(form.dni.trim())) return;
    const p = await buscarPaciente(form.dni.trim());
    if (p) setForm((f) => ({ ...f, nombre: p.nombre, apellido: p.apellido }));
  };

  const registrar = async () => {
    const { dni, nombre, apellido, fechaNacimiento, sintomas } = form;
    if (!/^\d{7,8}$/.test(dni.trim())) return setError("El DNI debe tener 7 u 8 números.");
    if (!SOLO_LETRAS.test(nombre.trim())) return setError("Ingresá un nombre válido (solo letras).");
    if (!SOLO_LETRAS.test(apellido.trim())) return setError("Ingresá un apellido válido (solo letras).");
    if (!fechaNacimiento || fechaNacimiento > hoyISO()) return setError("La fecha de nacimiento no es válida.");
    if (!sintomas.trim()) return setError("Describí los síntomas iniciales.");

    setGuardando(true);
    try {
      await registrarIngreso(
        {
          dni: dni.trim(),
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          fechaNacimiento,
          sintomas: sintomas.trim(),
          prioridad,
        },
        user
      );
      registrarAuditoria(user, "Registró ingreso a guardia", `Paciente #${dni.trim()}`);
      setForm(VACIO);
      setPrioridad("Baja");
      setManual(false);
      setAviso("Ingreso registrado. El paciente ya está en la cola de guardia.");
    } catch {
      setError("No se pudo registrar el ingreso. Probá de nuevo.");
    }
    setGuardando(false);
  };

  const filas = cola.map((g) => ({
    ...g,
    hora: g.creadoEn
      ? g.creadoEn.toDate().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
      : "—",
    paciente: `${g.nombre} ${g.apellido}`,
  }));

  return (
    <div>
      <PageHeader
        title="Registro de altas"
        subtitle="Ingresá al paciente en la guardia. El sistema sugiere la prioridad según los síntomas y vos podés corregirla."
      />

      <div className="panel-card mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">DNI</label>
            <input type="text" className="form-control" inputMode="numeric" maxLength={8}
              name="dni" value={form.dni} onChange={cambiar} onBlur={completarPorDni} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={cambiar} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellido</label>
            <input type="text" className="form-control" name="apellido" value={form.apellido} onChange={cambiar} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha de nacimiento</label>
            <input type="date" className="form-control" name="fechaNacimiento"
              max={hoyISO()} value={form.fechaNacimiento} onChange={cambiar} />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              Prioridad {manual ? "(manual)" : "(sugerida por el sistema)"}
            </label>
            <select className="form-select" value={prioridad}
              onChange={(e) => { setPrioridad(e.target.value); setManual(true); }}>
              {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Síntomas iniciales</label>
            <textarea className="form-control" rows="3" name="sintomas" value={form.sintomas}
              onChange={cambiar} placeholder="Describí los síntomas reportados..." />
          </div>
          {error && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{error}</div></div>}
          {aviso && <div className="col-12"><div className="alert alert-success py-2 mb-0">{aviso}</div></div>}
          <div className="col-12">
            <button className="btn btn-dusty" type="button" onClick={registrar} disabled={guardando}>
              {guardando ? "Registrando…" : "Registrar ingreso"}
            </button>
          </div>
        </div>
      </div>

      <h2>Cola de guardia</h2>
      <DataTable
        columns={[
          { key: "hora", label: "Llegada" },
          { key: "paciente", label: "Paciente" },
          { key: "dni", label: "DNI" },
          { key: "sintomas", label: "Síntomas" },
          { key: "prioridad", label: "Prioridad", estado: true },
          { key: "estado", label: "Estado", estado: true },
        ]}
        rows={filas}
      />
    </div>
  );
}