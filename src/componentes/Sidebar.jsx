import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    { label: "Gestión de reclamos", path: "/administrativo/reclamos" },
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
  const { user } = useAuth();
  const items = MENUS[role] || [];
  const iniciales = (user?.nombre || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="sidebar d-flex flex-column">
      <div className="sidebar-user">
        <span className="sidebar-avatar">{iniciales}</span>
        <div>
          <p className="sidebar-user-name">{user?.nombre}</p>
          <p className="sidebar-role">{ROLE_LABELS[role] || "Usuario"}</p>
        </div>
      </div>

      <nav className="sidebar-nav flex-grow-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}