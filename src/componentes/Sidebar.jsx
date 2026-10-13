import { NavLink, Link } from "react-router-dom";

const MENUS = {
  paciente: [
    { label: "Mi historial clínico", path: "/paciente/historial" },
    { label: "Turnos", path: "/paciente/turnos" },
    { label: "Repositorio de estudios", path: "/paciente/estudios" },
  ],
  medico: [
    { label: "Historia clínica", path: "/medico/historia" },
    { label: "Control de guardias", path: "/medico/guardias" },
    { label: "Derivación / Internación", path: "/medico/derivacion" },
    { label: "Prescripciones", path: "/medico/prescripciones" },
  ],
  enfermera: [
    { label: "Suministro de medicación", path: "/enfermera/medicacion" },
    { label: "Control de guardias", path: "/enfermera/guardias" },
    { label: "Insumos rápidos", path: "/enfermera/insumos" },
  ],
  administrativo: [
    { label: "Registro de altas", path: "/administrativo/altas" },
    { label: "Camas e internaciones", path: "/administrativo/camas" },
    { label: "Gestión de agenda", path: "/administrativo/agenda" },
  ],
  directivos: [
    { label: "Recursos del hospital", path: "/directivos/recursos" },
    { label: "Análisis de datos", path: "/directivos/analisis" },
    { label: "Supervisión de auditoría", path: "/directivos/auditoria" },
  ],
};

const ROLE_LABELS = {
  paciente: "Paciente",
  medico: "Médico/a",
  enfermera: "Enfermero/a",
  administrativo: "Administrativo",
  directivos: "Directivo/a",
};

export default function Sidebar({ role }) {
  const items = MENUS[role] || [];

  return (
    <aside className="sidebar d-flex flex-column">
      <Link to="/" className="sidebar-brand d-flex align-items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2H13V11H22V13H13V22H11V13H2V11H11V2Z" fill="currentColor" />
        </svg>
        <span>B.A.L.A</span>
      </Link>

      <p className="sidebar-role">{ROLE_LABELS[role] || "Usuario"}</p>

      <nav className="sidebar-nav flex-grow-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link to="/login" className="sidebar-link sidebar-logout">
        Cerrar sesión
      </Link>
    </aside>
  );
}
