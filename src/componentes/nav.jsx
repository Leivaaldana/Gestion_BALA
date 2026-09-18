import { NavLink, Link } from "react-router-dom";
import "../estilos/Nav.css";

export default function Nav() {
  const navLinkClass = ({ isActive }) =>
    `nav-link site-nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-nav py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-dusty"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 2H13V11H22V13H13V22H11V13H2V11H11V2Z" fill="currentColor" />
          </svg>
          B.A.L.A
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNav"
          aria-controls="siteNav"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="siteNav">
          <ul className="navbar-nav ms-auto gap-lg-4 mt-3 mt-lg-0">
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/equipo">
                El equipo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/anuncios">
                Anuncios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/asistencia">
                Asistencia
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/contacto">
                Contacto
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}