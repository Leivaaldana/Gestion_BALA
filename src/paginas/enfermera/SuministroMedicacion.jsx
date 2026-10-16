import { useState } from "react";
import PageHeader from "../../componentes/PageHeader";

const indicacionesIniciales = [
  { id: 1, paciente: "Juana Martínez", medicamento: "Ibuprofeno 400mg", hora: "10:00", administrado: false },
  { id: 2, paciente: "Carlos Gómez", medicamento: "Suero fisiológico", hora: "10:30", administrado: false },
  { id: 3, paciente: "Ana Ríos", medicamento: "Amoxicilina 500mg", hora: "11:00", administrado: true },
];

export default function SuministroMedicacion() {
  const [indicaciones, setIndicaciones] = useState(indicacionesIniciales);

  const toggle = (id) => {
    setIndicaciones((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, administrado: !item.administrado } : item
      )
    );
  };

  return (
    <div>
      <PageHeader
        title="Suministro de medicación"
        subtitle="Indicaciones médicas por paciente. Marcá cada fármaco como administrado."
      />

      <div className="panel-card">
        {indicaciones.map((item) => (
          <div className="check-row" key={item.id}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`ind-${item.id}`}
                checked={item.administrado}
                onChange={() => toggle(item.id)}
              />
              <label className="form-check-label" htmlFor={`ind-${item.id}`}>
                <strong>{item.paciente}</strong> — {item.medicamento} ({item.hora})
              </label>
            </div>
            <span className={`badge-estado ${item.administrado ? "badge-success" : "badge-warning"}`}>
              {item.administrado ? "Administrado" : "Pendiente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
