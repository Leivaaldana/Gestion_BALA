import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import BookingProgress from "../componentes/BookingProgress.jsx";
import PasswordInput from "../componentes/PasswordInput.jsx";
import logo from "../assets/Logotipo.jpeg";
import "../estilos/Login.css";

export default function Login() {
  const [dni, setDni] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const flujoReserva = location.state?.bookingFlow === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await login(dni, contrasena);
    setCargando(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (flujoReserva && res.rol === "paciente") {
      navigate("/paciente/turnos", { replace: true, state: { bookingFlow: true } });
      return;
    }
    navigate(ROLE_HOME[res.rol]);
  };
  return (
    <main className="institutional-page login-page">
      <div className="login-layout">
        <section className="login-intro">
          <p className="inst-kicker">CLÍNICA B.A.L.A. <span>· TU ESPACIO</span></p>
          <Link to="/" className="login-logo" aria-label="Volver al inicio">
            <img src={logo} alt="Clínica B.A.L.A." />
          </Link>
          <h1>Tu salud,<br />siempre <em>a mano.</em></h1>
          <p className="login-intro-copy">
            Ingresá a tu espacio para encontrar tus turnos e información, de forma simple y segura.
          </p>
          <div className="login-manifesto">
            <span>UN SOLO LUGAR</span>
            <strong>Todo lo que necesitás<br />para seguir cuidándote.</strong>
            <b>01 / ACCESO SEGURO</b>
          </div>
          <Link className="login-home-link" to="/">Volver al inicio <span aria-hidden="true">↗</span></Link>
        </section>

        <section className="login-form-panel">
          <div className="login-form-inner">
            <p className="login-kicker">QUÉ BUENO TENERTE DE VUELTA</p>
            <h2 className="auth-title">Iniciar sesión</h2>
            <p className="auth-sub">
              Ingresá tu DNI o correo electrónico y contraseña para acceder a tu cuenta.
            </p>

            {flujoReserva && (
              <div className="auth-booking-progress">
                <p>Un paso más para gestionar tu turno</p>
                <BookingProgress step={2} />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="identificador" className="form-label">
                  DNI o correo electrónico
                </label>
                <input
                  type="text"
                  id="identificador"
                  className="form-control auth-input"
                  placeholder="DNI o correo electrónico"
                  autoComplete="username"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <PasswordInput
                  id="password"
                  className="form-control auth-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
              </div>

              <div className="login-form-links">
                <Link to="/recuperar-contrasena" className="auth-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="login-submit" disabled={cargando}>
                {cargando ? "Ingresando…" : "Iniciar sesión"}
                <span aria-hidden="true">↗</span>
              </button>

              <p className="login-register-link">
                ¿No tenés cuenta todavía?{" "}
                <Link to="/registro" state={location.state} className="auth-link">
                  Registrate
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
