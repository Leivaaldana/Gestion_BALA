import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import "../estilos/Registro.css";

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const FORMATO_EMAIL = /^\S+@\S+\.\S+$/;

function FormularioRegistro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevos = validar();
    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    const res = registrar({
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

    navigate(ROLE_HOME[res.rol]);
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h1>Crear una cuenta</h1>

        <p className="subtitulo">Registrate para acceder a Clínica B.A.L.A</p>

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
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresá una contraseña"
              value={datos.contrasena}
              onChange={handleChange}
            />
            <span className="error">{errores.contrasena}</span>
          </div>

          <div className="campo">
            <label htmlFor="repetirContrasena">Repetir contraseña</label>
            <input
              type="password"
              id="repetirContrasena"
              name="repetirContrasena"
              placeholder="Repetí tu contraseña"
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
      </div>
    </div>
  );
}

export default FormularioRegistro;
