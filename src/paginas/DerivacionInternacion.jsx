import PageHeader from "../../componentes/PageHeader";

export default function DerivacionInternacion() {
  return (
    <div>
      <PageHeader
        title="Derivación / Internación"
        subtitle="Emití una orden de internación o derivá/reprogramá una consulta."
      />

      <div className="panel-card">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">DNI del paciente</label>
            <input type="text" className="form-control" inputMode="numeric" placeholder="Ej: 30123456" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo de orden</label>
            <select className="form-select">
              <option>Internación</option>
              <option>Derivación a otra especialidad</option>
              <option>Reprogramación de turno</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Sector</label>
            <select className="form-select">
              <option>Internación general</option>
              <option>Terapia intensiva</option>
              <option>Guardia</option>
              <option>Quirófano</option>
              <option>Maternidad</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Prioridad</label>
            <select className="form-select">
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Motivo / Observaciones</label>
            <textarea className="form-control" rows="4" placeholder="Detalle clínico de la derivación..." />
          </div>
          <div className="col-12">
            <button className="btn btn-dusty" type="button">
              Emitir orden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
