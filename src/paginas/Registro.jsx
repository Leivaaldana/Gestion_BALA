import React from "react";
import "./css/Registro.css";

function FormularioRegistro() {
  return (
    <div className="registro-container">
      <div className="registro-box">
        <h1>Crear una cuenta</h1>

        <p className="subtitulo">
          Registrate para acceder a Netbook Escolar
        </p>

        <form id="registroForm">
          <div className="campo">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              placeholder="Ingresá tu DNI"
              maxLength={8}
            />
            <span className="error" id="errorDni"></span>
          </div>

          <div className="campo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="Ingresá tu correo"
            />
            <span className="error" id="errorCorreo"></span>
          </div>

          <div className="campo">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresá una contraseña"
            />
            <span className="error" id="errorContrasena"></span>
          </div>

          <div className="campo">
            <label htmlFor="repetirContrasena">
              Repetir contraseña
            </label>
            <input
              type="password"
              id="repetirContrasena"
              name="repetirContrasena"
              placeholder="Repetí tu contraseña"
            />
            <span className="error" id="errorRepetir"></span>
          </div>

          <button type="submit">Registrarme</button>

          <p id="mensajeExito" className="exito"></p>
        </form>
      </div>
    </div>
  );
}

export default FormularioRegistro;
