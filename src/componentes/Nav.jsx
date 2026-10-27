import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import "../estilos/Nav.css";

// Rutas donde el header NO se muestra
const RUTAS_SIN_HEADER = ["/login", "/registro"];

export default function Nav() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === "/";
  const oculto = RUTAS_SIN_HEADER.includes(pathname);
  const [scrolled, setScrolled] = useState(false);

  // Solo en la página de inicio: transparente arriba, sólido al bajar
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Los hooks van siempre arriba; recién acá decidimos si se dibuja
  if (oculto) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link site-nav-link ${isActive ? "active" : ""}`;

  const classes = ["navbar", "navbar-expand-lg", "navbar-dark", "site-nav", "py-3"];
  if (isHome) classes.push("site-nav--home");
  if (isHome && !scrolled) classes.push("site-nav--top");

  return (
    <nav className={classes.join(" ")}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-dusty" xmlns="http://www.w3.org/2000/svg">
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
          <ul className="navbar-nav mx-auto gap-lg-4 mt-3 mt-lg-0">
            <li className="nav-item"><NavLink className={navLinkClass} to="/equipo">El equipo</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/anuncios">Anuncios</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/asistencia">Asistencia</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/contacto">Contacto</NavLink></li>
          </ul>

          {/* Esta zona cambia según haya sesión o no */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <>
                <span className="site-nav-user d-none d-xl-inline">{user.nombre}</span>
                <Link className="btn btn-dusty" to={ROLE_HOME[user.rol] || "/"}>
                  Mi panel
                </Link>
                <button className="btn btn-outline-ivory" type="button" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-ivory" to="/registro">Registrarse</Link>
                <Link className="btn btn-dusty" to="/login">Iniciar sesión</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
