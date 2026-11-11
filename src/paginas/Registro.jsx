import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import BookingProgress from "../componentes/BookingProgress.jsx";
import PasswordInput from "../componentes/PasswordInput.jsx";
import logo from "../assets/Logotipo.jpeg";
import "../estilos/Registro.css";

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const FORMATO_EMAIL = /^\S+@\S+\.\S+$/;

function FormularioRegistro() {
  const { registrar } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const flujoReserva = location.state?.bookingFlow === true;

  const [datos, setDatos] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    repetirContrasena: "",
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    // al volver a escribir en un campo, se limpia su error
    setErrores({ ...errores, [name]: "", general: "" });
  };

  const validar = () => {
    const nuevos = {};

    if (!/^\d{7,8}$/.test(datos.dni.trim()))
      nuevos.dni = "El DNI debe tener 7 u 8 números.";

    if (!datos.nombre.trim()) nuevos.nombre = "Ingresá tu nombre.";
    else if (!SOLO_LETRAS.test(datos.nombre.trim()))
      nuevos.nombre = "El nombre solo puede tener letras.";

    if (!datos.apellido.trim()) nuevos.apellido = "Ingresá tu apellido.";
    else if (!SOLO_LETRAS.test(datos.apellido.trim()))
      nuevos.apellido = "El apellido solo puede tener letras.";

    if (!datos.correo.trim()) nuevos.correo = "Ingresá tu correo.";
    else if (!FORMATO_EMAIL.test(datos.correo.trim()))
      nuevos.correo = "Ingresá un correo válido.";

    if (datos.contrasena.length < 6)
      nuevos.contrasena = "La contraseña debe tener al menos 6 caracteres.";

    if (datos.repetirContrasena !== datos.contrasena)
      nuevos.repetirContrasena = "Las contraseñas no coinciden.";

    return nuevos;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const nuevos = validar();
  if (Object.keys(nuevos).length > 0) {
    setErrores(nuevos);
    return;
  }

  const res = await registrar({
    dni: datos.dni,
    nombre: datos.nombre,
    apellido: datos.apellido,
    email: datos.correo,
    contrasena: datos.contrasena,
  });

  if (!res.ok) {
    setErrores({ general: res.error });
    return;
  }

  if (flujoReserva && res.rol === "paciente") {
    navigate("/paciente/turnos", { replace: true, state: { bookingFlow: true } });
    return;
  }
  navigate(ROLE_HOME[res.rol]);
};

  return (
    <main className="institutional-page registro-container">
      <div className="registro-layout">
        <section className="registro-intro">
          <p className="inst-kicker">CLÍNICA B.A.L.A. <span>· NUEVO PACIENTE</span></p>
          <h1>Tu cuidado<br />empieza <em>acá.</em></h1>
          <p className="registro-intro-copy">
            Creá tu cuenta para gestionar turnos y tener tu información a mano, en un solo lugar.
          </p>
          <div className="registro-manifesto">
            <span>UN PASO A LA VEZ</span>
            <strong>Estamos<br />para acompañarte.</strong>
            <b>01 / ACCESO AL PORTAL</b>
          </div>
          <Link className="registro-contact-link" to="/">Volver al inicio <span aria-hidden="true">↗</span></Link>
        </section>

        <section className="registro-box">
          <div className="registro-form-heading">
            <Link to="/" className="registro-logo" aria-label="Volver al inicio">
              <img src={logo} alt="Clínica B.A.L.A." />
            </Link>
            <div>
              <p className="registro-kicker">CREÁ TU ACCESO</p>
              <h2>Crear una cuenta</h2>
              <p className="subtitulo">Registrate para acceder a Clínica B.A.L.A</p>
            </div>
          </div>
          {flujoReserva && (
            <div className="registro-booking-progress">
              <p>Creá tu cuenta y enseguida vas a poder reservar</p>
              <BookingProgress step={2} />
            </div>
          )}

          <form id="registroForm" onSubmit={handleSubmit} noValidate>
          <div className="campo">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              placeholder="Ingresá tu DNI"
              maxLength={8}
              inputMode="numeric"
              value={datos.dni}
              onChange={handleChange}
            />
            <span className="error">{errores.dni}</span>
          </div>

          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresá tu nombre"
              value={datos.nombre}
              onChange={handleChange}
            />
            <span className="error">{errores.nombre}</span>
          </div>

          <div className="campo">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Ingresá tu apellido"
              value={datos.apellido}
              onChange={handleChange}
            />
            <span className="error">{errores.apellido}</span>
          </div>

          <div className="campo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="Ingresá tu correo"
              value={datos.correo}
              onChange={handleChange}
            />
            <span className="error">{errores.correo}</span>
          </div>

          <div className="campo">
            <label htmlFor="contrasena">Contraseña</label>
            <PasswordInput
              id="contrasena"
              name="contrasena"
              placeholder="Ingresá una contraseña"
              autoComplete="new-password"
              value={datos.contrasena}
              onChange={handleChange}
            />
            <span className="error">{errores.contrasena}</span>
          </div>

          <div className="campo">
            <label htmlFor="repetirContrasena">Repetir contraseña</label>
            <PasswordInput
              id="repetirContrasena"
              name="repetirContrasena"
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              value={datos.repetirContrasena}
              onChange={handleChange}
            />
            <span className="error">{errores.repetirContrasena}</span>
          </div>

          {/* Errores que vienen del sistema (DNI o correo ya registrados) */}
          <span className="error">{errores.general}</span>

          <button type="submit">Registrarme</button>

          <p className="subtitulo">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link> ·{" "}
            <Link to="/">Volver al inicio</Link>
          </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default FormularioRegistro;
