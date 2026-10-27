import { Link } from "react-router-dom";
import "../estilos/Principal.css";

export default function Principal() {
  return (
    <div className="home">
      <section className="hero py-5">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
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
                {/* Sin sesión, la ruta protegida lo lleva al login */}
                <Link className="btn btn-dusty btn-lg BotonP" to="/paciente/turnos">
                  Reservar un turno
                </Link>
                <Link className="btn btn-outline-ivory btn-lg BotonP" to="/equipo">
                  Conocé al equipo
                </Link>
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

      <footer className="bg-navy text-ivory py-4 footer-bala">
        <div className="container">
          <nav className="footer-links text-center pb-3">
            <a href="/terminos">Términos y Condiciones</a>
            <span className="footer-sep">|</span>
            <a href="/calidad">Política de calidad B.A.L.A</a>
            <span className="footer-sep">|</span>
            <a href="/legales">Legales</a>
          </nav>
          <div className="footer-divider"></div>
          <p className="text-center mb-0 pt-3 small">
            © {new Date().getFullYear()} Clínica B.A.L.A
          </p>
        </div>
      </footer>
    </div>
  );
}
