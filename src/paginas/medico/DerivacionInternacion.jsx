import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { buscarPaciente, registrarAuditoria } from "../../servicios/historias";
import { PRIORIDADES } from "../../servicios/guardia";
import {
  TIPOS_ORDEN, SECTORES, emitirOrden, escucharOrdenes,
} from "../../servicios/internaciones";

const VACIO = { dni: "", tipo: TIPOS_ORDEN[0], sector: SECTORES[0], prioridad: "Media", motivo: "" };

export default function DerivacionInternacion() {
  const { user } = useAuth();
  const [form, setForm] = useState(VACIO);
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(
    () => escucharOrdenes(setOrdenes, { campo: "medicoDni", valor: user.dni }),
    [user.dni]
  );

  const cambiar = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(""); setAviso("");
  };

  const emitir = async () => {
    if (!/^\d{7,8}$/.test(form.dni.trim())) return setError("El DNI debe tener 7 u 8 números.");
    if (!form.motivo.trim()) return setError("Escribí el motivo u observaciones.");

    setGuardando(true);
    try {
      const p = await buscarPaciente(form.dni.trim());
      if (!p) {
        setError("No se encontró un paciente con ese DNI.");
        setGuardando(false);
        return;
      }
      await emitirOrden(
        {
          pacienteDni: p.dni,
          pacienteNombre: `${p.nombre} ${p.apellido}`,
          tipo: form.tipo,
          sector: form.tipo === "Internación" ? form.sector : "—",
          prioridad: form.prioridad,
          motivo: form.motivo.trim(),
        },
        user
      );
      registrarAuditoria(user, `Emitió orden: ${form.tipo}`, `Paciente #${p.dni}`);
      setForm(VACIO);
      setAviso(
        form.tipo === "Internación"
          ? "Orden emitida. Administración ya la ve para asignar una cama."
          : "Orden registrada."
      );
    } catch {
      setError("No se pudo emitir la orden. Probá de nuevo.");
    }
    setGuardando(false);
  };

  const esInternacion = form.tipo === "Internación";

  return (
    <div>
      <PageHeader
        title="Derivación / Internación"
        subtitle="Emití una orden de internación o derivá/reprogramá una consulta."
      />

      <div className="panel-card mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">DNI del paciente</label>
            <input type="text" className="form-control" inputMode="numeric" maxLength={8}
              name="dni" value={form.dni} onChange={cambiar} placeholder="Ej: 30111111" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo de orden</label>
            <select className="form-select" name="tipo" value={form.tipo} onChange={cambiar}>
              {TIPOS_ORDEN.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Sector</label>
            <select className="form-select" name="sector" value={form.sector}
              onChange={cambiar} disabled={!esInternacion}>
              {SECTORES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Prioridad</label>
            <select className="form-select" name="prioridad" value={form.prioridad} onChange={cambiar}>
              {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Motivo / Observaciones</label>
            <textarea className="form-control" rows="4" name="motivo" value={form.motivo}
              onChange={cambiar} placeholder="Detalle clínico de la derivación..." />
          </div>
          {error && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{error}</div></div>}
          {aviso && <div className="col-12"><div className="alert alert-success py-2 mb-0">{aviso}</div></div>}
          <div className="col-12">
            <button className="btn btn-dusty" type="button" onClick={emitir} disabled={guardando}>
              {guardando ? "Emitiendo…" : "Emitir orden"}
            </button>
          </div>
        </div>
      </div>

      <h2>Mis órdenes</h2>
      <DataTable
        columns={[
          { key: "pacienteNombre", label: "Paciente" },
          { key: "tipo", label: "Tipo" },
          { key: "sector", label: "Sector" },
          { key: "prioridad", label: "Prioridad", estado: true },
          { key: "estado", label: "Estado", estado: true },
          { key: "cama", label: "Cama" },
        ]}
        rows={ordenes.map((o) => ({
          ...o,
          cama: o.habitacionNumero ? `Hab. ${o.habitacionNumero}` : "—",
        }))}
      />
    </div>
  );
}