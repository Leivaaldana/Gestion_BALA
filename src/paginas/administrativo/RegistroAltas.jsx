import PageHeader from "../../componentes/PageHeader";

export default function RegistroAltas() {
  return (
    <div>
      <PageHeader
        title="Registro de altas"
        subtitle="Dar de alta a un paciente en la guardia con sus datos y síntomas iniciales."
      />

      <div className="panel-card">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">DNI</label>
            <input type="text" className="form-control" inputMode="numeric" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellido</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha de nacimiento</label>
            <input type="date" className="form-control" />
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
            <label className="form-label">Síntomas iniciales</label>
            <textarea className="form-control" rows="4" placeholder="Describí los síntomas reportados..." />
          </div>
          <div className="col-12">
            <button className="btn btn-dusty" type="button">
              Registrar ingreso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
