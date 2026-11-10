import { useState } from "react";
import { enviarReclamo } from "../servicios/reclamos";
import "../estilos/Contactos.css";

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiarCampo = (e) => {
    setFormulario((actual) => ({ ...actual, [e.target.name]: e.target.value }));
    setError("");
    setExito("");
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    setEnviando(true);
    try {
      await enviarReclamo(formulario);
      setFormulario({ nombre: "", email: "", asunto: "", mensaje: "" });
      setExito("Recibimos tu mensaje. Nuestro equipo se pondrá en contacto con vos por correo.");
    } catch {
      setError("No se pudo enviar el mensaje. Revisá tu conexión e intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contacto-page">

      {/* CONTENIDO PRINCIPAL */}
      <main className="contacto-container">

        <section className="contacto-intro">
          <h1>Estamos para cuidarte</h1>
          <p>
            ¿Tenés dudas, necesitás coordinar un turno o querés hacernos una consulta? 
            Completá el formulario y nuestro equipo te responderá a la brevedad.
          </p>
        </section>

        <section className="contacto-content">

          {/* INFORMACIÓN */}
          <div className="contacto-info">
            <div>
              <h2>Información de contacto</h2>

              <div className="info-item">
                <div className="icono">📍</div>
                <div>
                  <h3>Ubicación</h3>
                  <p>Neuquén, Argentina</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icono">📞</div>
                <div>
                  <h3>Teléfono</h3>
                  <p>299 673 2039</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icono">✉️</div>
                <div>
                  <h3>Email</h3>
                  <p>contacto@misitio.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icono">🕐</div>
                <div>
                  <h3>Horarios de atención</h3>
                  <p>Lunes a Viernes de 9:00 a 18:00 hs</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="contacto-form">
            <h2>Envianos un mensaje</h2>

            <form onSubmit={enviar}>
              <div className="form-row">
                <div className="campo">
                  <label htmlFor="nombre">Nombre y Apellido</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: María Pérez"
                    value={formulario.nombre}
                    onChange={cambiarCampo}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="tuemail@gmail.com"
                    value={formulario.email}
                    onChange={cambiarCampo}
                    maxLength={254}
                    required
                  />
                </div>
              </div>

              <div className="campo">
                <label htmlFor="asunto">Asunto / Motivo</label>
                <input
                  type="text"
                  id="asunto"
                  placeholder="¿En qué podemos ayudarte?"
                  name="asunto"
                  value={formulario.asunto}
                  onChange={cambiarCampo}
                  maxLength={150}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="5"
                  placeholder="Escribí tu consulta con confianza..."
                  value={formulario.mensaje}
                  onChange={cambiarCampo}
                  maxLength={5000}
                  required
                />
              </div>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {exito && <div className="alert alert-success" role="status">{exito}</div>}

              <button type="submit" disabled={enviando}>
                {enviando ? "Enviando…" : "Enviar mensaje"}
              </button>
            </form>
          </div>

        </section>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="contacto-footer">
        <p>© 2026 Clínica. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default Contacto;