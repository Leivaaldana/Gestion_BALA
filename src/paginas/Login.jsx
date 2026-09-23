import { Link } from "react-router-dom";
import logo from "../assets/Logotipo.png";
import "../estilos/Login.css";

export default function Login() {
  return (
    <div className="auth-split">
      <div className="auth-visual d-none d-lg-flex">
        <div className="auth-visual-overlay">
          <Link to="/" className="auth-visual-logo d-inline-flex align-items-center gap-2">
            <img src={logo} alt="Logotipo" />
            <span>B.A.L.A</span>
          </Link>

          <blockquote className="auth-visual-quote">
            <p>
              "Toda tu atención médica, en un solo lugar: turnos, historial y
              resultados, cuando los necesites."
            </p>
          </blockquote>
        </div>
      </div>

      <div className="auth-form-panel d-flex align-items-center justify-content-center">
        <div className="auth-form-inner">
          <Link to="/" className="auth-logo d-flex align-items-center gap-2 mb-5 d-lg-none">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2H13V11H22V13H13V22H11V13H2V11H11V2Z" fill="currentColor" />
            </svg>
            <span>B.A.L.A</span>
          </Link>

          <h1 className="auth-title mb-2">Bienvenido de nuevo</h1>
          <p className="auth-sub mb-4">
            Ingresá tu DNI y contraseña para acceder a tu cuenta.
          </p>

          <form>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">
                DNI
              </label>
              <input
                type="text"
                id="dni"
                className="form-control auth-input"
                placeholder="Ej: 30123456"
                inputMode="numeric"
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="form-control auth-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-end mb-4">
              <Link to="/recuperar-contrasena" className="auth-link small">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn btn-dusty w-100 btn-lg mb-4">
              Iniciar sesión
            </button>

            <p className="text-center mb-0 small">
              ¿No tenés cuenta todavía?{" "}
              <Link to="/registro" className="auth-link fw-semibold">
                Registrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
