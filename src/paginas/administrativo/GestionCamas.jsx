import PageHeader from "../../componentes/PageHeader";

const habitaciones = [
  { id: 1, numero: 101, piso: 1, sector: "Internación", estado: "disponible" },
  { id: 2, numero: 102, piso: 1, sector: "Internación", estado: "ocupada" },
  { id: 3, numero: 103, piso: 1, sector: "Internación", estado: "mantenimiento" },
  { id: 4, numero: 201, piso: 2, sector: "Terapia intensiva", estado: "ocupada" },
  { id: 5, numero: 202, piso: 2, sector: "Terapia intensiva", estado: "reservada" },
  { id: 6, numero: 203, piso: 2, sector: "Terapia intensiva", estado: "disponible" },
];

const ESTADO_LABEL = {
  disponible: "Disponible",
  ocupada: "Ocupada",
  mantenimiento: "Mantenimiento",
  reservada: "Reservada",
};

export default function GestionCamas() {
  return (
    <div>
      <PageHeader
        title="Gestión de camas e internaciones"
        subtitle="Monitoreá las habitaciones ocupadas y libres por piso, y asigná camas."
      />

      <div className="room-grid">
        {habitaciones.map((h) => (
          <div key={h.id} className={`room-card estado-${h.estado}`}>
            <h3>Hab. {h.numero}</h3>
            <p>Piso {h.piso} · {h.sector}</p>
            <span className={`badge-estado ${
              h.estado === "disponible" ? "badge-success" :
              h.estado === "ocupada" ? "badge-danger" :
              h.estado === "reservada" ? "badge-warning" : "badge-muted"
            }`}>
              {ESTADO_LABEL[h.estado]}
            </span>
            {h.estado === "disponible" && (
              <div className="mt-2">
                <button className="btn btn-sm btn-dusty w-100">Asignar paciente</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
