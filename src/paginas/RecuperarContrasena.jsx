import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logotipo.jpeg";
import "../estilos/Login.css";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { recuperarContrasena } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setCargando(true);
    const resultado = await recuperarContrasena(email);
    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setMensaje("Si el correo está asociado a una cuenta, recibirás un enlace para restablecer la contraseña. Revisá también la carpeta de spam.");
  };

  return (
    <div className="auth-split">
      <div className="auth-visual d-none d-lg-flex">
        <div className="auth-visual-overlay">
          <Link to="/" className="auth-visual-logo d-inline-flex align-items-center gap-2">
            <img src={logo} alt="Clínica B.A.L.A." />
          </Link>
          <blockquote className="auth-visual-quote">
            <p>Recuperá el acceso a tu cuenta de forma segura.</p>
          </blockquote>
        </div>
      </div>

      <div className="auth-form-panel d-flex align-items-center justify-content-center">
        <div className="auth-form-inner">
          <Link to="/" className="auth-logo d-flex align-items-center gap-2 mb-5 d-lg-none">
            <img src={logo} alt="Clínica B.A.L.A." />
          </Link>
          <h1 className="auth-title mb-2">Recuperar contraseña</h1>
          <p className="auth-sub mb-4">
            Ingresá el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecerla.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email-recuperacion" className="form-label">Correo electrónico</label>
              <input
                type="email"
                id="email-recuperacion"
                className="form-control auth-input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
            {mensaje && <div className="alert alert-success py-2" role="status">{mensaje}</div>}

            <button type="submit" className="btn btn-dusty w-100 btn-lg mb-3" disabled={cargando}>
              {cargando ? "Enviando…" : "Enviar enlace"}
            </button>
            <p className="text-center mb-0 small">
              <Link to="/login" className="auth-link fw-semibold">Volver a iniciar sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
