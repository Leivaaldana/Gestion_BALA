import "../estilos/Principal.css";

export default function Home() {
  return (
    <div className="home">
      <nav className="navbar navbar-expand-lg navbar-dark bg-navy py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-bold" href="/">
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
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#homeNav"
            aria-controls="homeNav"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="homeNav">
            <ul className="navbar-nav mx-auto gap-lg-4 mt-3 mt-lg-0">
              <li className="nav-item">
                <a className="nav-link text-ivory" href="/equipo">El equipo</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-ivory" href="/anuncios">Anuncios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-ivory" href="/asistencia">Asistencia</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-ivory" href="/contacto">Contacto</a>
              </li>
            </ul>

            <div className="d-flex gap-2 mt-3 mt-lg-0">
              <a className="btn btn-outline-ivory" href="/registro">Registrarse</a>
              <a className="btn btn-dusty" href="/login">Iniciar sesión</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero py-5">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="hero-eyebrow d-inline-block mb-3">
                Ecosistema de hospital
              </span>
              <h1 className="hero-title mb-4">
                Toda la clínica,
                <br />
                en un solo lugar.
              </h1>
              <p className="hero-sub mb-4 mx-auto mx-lg-0">
                Turnos, historiales clínicos, guardias y stock de farmacia
                centralizados en un sistema pensado para pacientes, médicos y
                personal administrativo.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                <a className="btn btn-dusty btn-lg" href="/login">
                  Reservar un turno
                </a>
                <a className="btn btn-outline-ivory btn-lg" href="/equipo">
                  Conocé al equipo
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <svg viewBox="0 0 420 420" className="hero-art mx-auto d-block" aria-hidden="true">
                <circle cx="210" cy="210" r="200" className="art-ring" />
                <rect x="130" y="90" width="160" height="220" rx="18" className="art-panel" />
                <path
                  d="M175 165H245M210 130V200"
                  className="art-cross"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <rect x="150" y="230" width="120" height="12" rx="6" className="art-line" />
                <rect x="150" y="256" width="90" height="12" rx="6" className="art-line" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-buttercream">
        <div className="container py-4">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="pillar h-100">
                <span className="pillar-label">Turnos</span>
                <h2 className="h4 mt-2 mb-2 text-midnight">Reservá sin esperas</h2>
                <p className="mb-0 text-navy-70">
                  Filtrá por especialidad y elegí el horario disponible, sin
                  llamadas ni planillas cruzadas.
                </p>
              </div>
            </div>

            <div className="col">
              <div className="pillar h-100 pillar-border">
                <span className="pillar-label">Historial</span>
                <h2 className="h4 mt-2 mb-2 text-midnight">
                  Tu información, centralizada
                </h2>
                <p className="mb-0 text-navy-70">
                  Diagnósticos, estudios y tratamientos accesibles para el
                  personal autorizado, en un solo lugar.
                </p>
              </div>
            </div>

            <div className="col">
              <div className="pillar h-100 pillar-border">
                <span className="pillar-label">Tiempo real</span>
                <h2 className="h4 mt-2 mb-2 text-midnight">
                  Ocupación al instante
                </h2>
                <p className="mb-0 text-navy-70">
                  Consultá la disponibilidad de médicos y el tiempo estimado de
                  espera de cada sector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-navy text-ivory py-3">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small">
          <span>© {new Date().getFullYear()} Clínica B.A.L.A</span>
          <nav className="d-flex gap-3">
            <a className="text-ivory" href="/contacto">Contacto</a>
            <a className="text-ivory" href="/asistencia">Asistencia</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
