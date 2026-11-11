import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import BookingProgress from "../componentes/BookingProgress.jsx";
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
    <div className="auth-split">
      <div className="auth-visual d-none d-lg-flex">
        <div className="auth-visual-overlay">
          <Link to="/" className="auth-visual-logo d-inline-flex align-items-center gap-2">
            <img src={logo} alt="Clínica B.A.L.A." />
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
            <img src={logo} alt="Clínica B.A.L.A." />
          </Link>

          {flujoReserva && (
            <div className="auth-booking-progress">
              <p>Un paso más para gestionar tu turno</p>
              <BookingProgress step={2} />
            </div>
          )}
          <h1 className="auth-title mb-2">Bienvenido de nuevo</h1>
          <p className="auth-sub mb-4">
            Ingresá tu DNI o correo electrónico y contraseña para acceder a tu cuenta.
          </p>

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
              <input
                type="password"
                id="password"
                className="form-control auth-input"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <div className="text-end mb-4">
              <Link to="/recuperar-contrasena" className="auth-link small">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
  )}

  <button type="submit" className="btn btn-dusty w-100 btn-lg mb-4" disabled={cargando}>
    {cargando ? "Ingresando…" : "Iniciar sesión"}
  </button>

  <p className="text-center mb-0 small">
    ¿No tenés cuenta todavía?{" "}
    <Link to="/registro" state={location.state} className="auth-link fw-semibold">
      Registrate
    </Link>
  </p>
</form>
        </div>
      </div>
    </div>
  );
}
