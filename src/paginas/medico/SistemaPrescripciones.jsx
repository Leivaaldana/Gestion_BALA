import { useEffect, useState } from "react";
import PageHeader from "../../componentes/PageHeader";
import DataTable from "../../componentes/DataTable";
import { useAuth } from "../../context/AuthContext";
import { hoyISO, formatearFecha } from "../../servicios/turnos";
import { buscarPaciente, obtenerHistorial, registrarAuditoria } from "../../servicios/historias";
import {
  UMBRAL_STOCK, ErrorStock, escucharMedicamentos, emitirReceta,
} from "../../servicios/prescripciones";

export default function SistemaPrescripciones() {
  const { user } = useAuth();
  const [meds, setMeds] = useState([]);
  const [dni, setDni] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [alergias, setAlergias] = useState("");
  const [items, setItems] = useState([]); // [{ medicamentoId, cantidad }]
  const [indicaciones, setIndicaciones] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [alertas, setAlertas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => escucharMedicamentos(setMeds), []);

  const hoy = hoyISO();
  const vencido = (m) => m.fechaVencimiento <= hoy;
  const stockBajo = meds.filter((m) => m.stock < UMBRAL_STOCK && !vencido(m));

  const buscar = async () => {
    setError(""); setAviso(""); setAlertas([]); setPaciente(null); setAlergias("");
    if (!/^\d{7,8}$/.test(dni.trim())) {
      setError("El DNI debe tener 7 u 8 números.");
      return;
    }
    const p = await buscarPaciente(dni.trim());
    if (!p) {
      setError("No se encontró un paciente con ese DNI.");
      return;
    }
    const h = await obtenerHistorial(p.dni);
    setAlergias(h.alergias);
    setPaciente(p);
    setItems([]);
    setIndicaciones("");
    registrarAuditoria(user, "Consultó historia clínica", `Paciente #${p.dni}`);
  };

  const agregar = (m) =>
    setItems((prev) =>
      prev.some((i) => i.medicamentoId === m.id) ? prev : [...prev, { medicamentoId: m.id, cantidad: 1 }]
    );

  const cambiarCantidad = (id, valor) =>
    setItems((prev) =>
      prev.map((i) => (i.medicamentoId === id ? { ...i, cantidad: Math.max(1, Number(valor) || 1) } : i))
    );

  const quitar = (id) => setItems((prev) => prev.filter((i) => i.medicamentoId !== id));

  const emitir = async () => {
    setError(""); setAviso(""); setAlertas([]);
    if (items.length === 0) return setError("Agregá al menos un medicamento.");
    if (!indicaciones.trim()) return setError("Escribí las indicaciones (dosis y frecuencia).");

    setGuardando(true);
    try {
      const bajos = await emitirReceta({ paciente, medico: user, items, indicaciones: indicaciones.trim() });
      registrarAuditoria(user, "Emitió receta", `Paciente #${paciente.dni}`);
      setAlertas(bajos);
      setAviso("Receta emitida. El stock se descontó y la enfermería ya ve las indicaciones.");
      setItems([]);
      setIndicaciones("");
    } catch (e) {
      setError(e instanceof ErrorStock ? e.message : "No se pudo emitir la receta. Probá de nuevo.");
    }
    setGuardando(false);
  };

  const filas = meds.map((m) => ({
    ...m,
    vencimiento: formatearFecha(m.fechaVencimiento),
    situacion: vencido(m) ? "Vencido" : m.stock < UMBRAL_STOCK ? "Stock bajo" : "OK",
  }));

  const tieneAlergias = alergias && alergias.trim().toLowerCase() !== "ninguna";

  return (
    <div>
      <PageHeader
        title="Sistema de prescripciones"
        subtitle="Buscá al paciente, elegí los fármacos disponibles y emití la receta."
      />

      {stockBajo.length > 0 && (
        <div className="alert alert-warning">
          <strong>Stock bajo:</strong> {stockBajo.map((m) => `${m.nombre} (${m.stock})`).join(", ")}
        </div>
      )}

      <div className="panel-card mb-4">
        <label className="form-label">Paciente (DNI)</label>
        <div className="d-flex gap-2">
          <input
            type="text" className="form-control" placeholder="Ej: 30111111" inputMode="numeric"
            value={dni} onChange={(e) => setDni(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
          />
          <button className="btn btn-dusty" type="button" onClick={buscar}>Buscar</button>
        </div>
        {paciente && (
          <p className="fw-semibold mt-3 mb-0">
            {paciente.nombre} {paciente.apellido} (DNI {paciente.dni})
          </p>
        )}
        {tieneAlergias && (
          <div className="alert alert-danger py-2 mt-3 mb-0">
            ⚠ Alergias registradas: <strong>{alergias}</strong>
          </div>
        )}
        {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
        {aviso && <div className="alert alert-success py-2 mt-3 mb-0">{aviso}</div>}
        {alertas.length > 0 && (
          <div className="alert alert-warning py-2 mt-3 mb-0">
            ⚠ Quedó con stock bajo: {alertas.join(", ")}
          </div>
        )}
      </div>

      {paciente && (
        <div className="panel-card mb-4">
          <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Receta en curso</h2>
          {items.length === 0 && (
            <p className="text-muted">Elegí medicamentos de la tabla de abajo con el botón "Agregar".</p>
          )}
          {items.map((i) => {
            const m = meds.find((x) => x.id === i.medicamentoId);
            return (
              <div className="check-row" key={i.medicamentoId}>
                <span><strong>{m?.nombre}</strong> {m?.dosis} · {m?.presentacion}</span>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number" min="1" max={m?.stock} className="form-control form-control-sm"
                    style={{ width: 80 }} value={i.cantidad}
                    onChange={(e) => cambiarCantidad(i.medicamentoId, e.target.value)}
                  />
                  <button className="btn btn-sm btn-outline-midnight" onClick={() => quitar(i.medicamentoId)}>
                    Quitar
                  </button>
                </div>
              </div>
            );
          })}
          <label className="form-label mt-3">Indicaciones (dosis y frecuencia)</label>
          <textarea
            className="form-control" rows="3" value={indicaciones}
            placeholder="Ej: 1 comprimido cada 8 horas durante 5 días"
            onChange={(e) => setIndicaciones(e.target.value)}
          />
          <button className="btn btn-dusty mt-3" type="button" onClick={emitir} disabled={guardando}>
            {guardando ? "Emitiendo…" : "Emitir receta"}
          </button>
        </div>
      )}

      <h2 className="h5 mb-3" style={{ color: "var(--midnight)" }}>Medicamentos disponibles</h2>
      <DataTable
        columns={[
          { key: "nombre", label: "Medicamento" },
          { key: "principioActivo", label: "Principio activo" },
          { key: "presentacion", label: "Presentación" },
          { key: "dosis", label: "Dosis" },
          { key: "stock", label: "Stock" },
          { key: "vencimiento", label: "Vence" },
          { key: "situacion", label: "Situación", estado: true },
        ]}
        rows={filas}
        renderActions={(row) => (
          <button
            className="btn btn-sm btn-dusty"
            disabled={!paciente || row.stock < 1 || row.situacion === "Vencido"}
            onClick={() => agregar(row)}
          >
            Agregar
          </button>
        )}
      />
    </div>
  );
}