import { useState } from "react";
import { enviarReclamo } from "../servicios/reclamos";
import hospital from "../assets/sibtain-ali-9zRDsfUQ0bo-unsplash.jpg";
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
    <div className="institutional-page contacto-page">
      <main className="contacto-container">
        <section className="contacto-intro">
          <div className="contacto-intro-copy">
            <p className="inst-kicker">CLÍNICA B.A.L.A. <span>· CONTACTO</span></p>
            <h1>Estamos para<br /><em>cuidarte.</em></h1>
            <p>
              ¿Tenés dudas, necesitás coordinar un turno o querés hacernos una consulta?
              Completá el formulario y nuestro equipo te responderá a la brevedad.
            </p>
          </div>
          <div className="contacto-intro-image">
            <img src={hospital} alt="Espacio de atención dentro de la clínica" />
            <span>ESTAMOS<br />PARA VOS</span>
            <b>ESCUCHAR TAMBIÉN ES CUIDAR.</b>
          </div>
          <span className="contacto-index">B.A.L.A. / 04</span>
        </section>

        <section className="contacto-content">
          <div className="contacto-info">
            <div>
              <p className="contacto-section-kicker">ENCONTRANOS</p>
              <h2>Información de contacto</h2>

              <div className="info-item">
                <div className="icono" aria-hidden="true">01</div>
                <div>
                  <h3>Ubicación</h3>
                  <p>Neuquén, Argentina</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icono" aria-hidden="true">02</div>
                <div>
                  <h3>Teléfono</h3>
                  <p>299 673 2039</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icono" aria-hidden="true">03</div>
                <div>
                  <h3>Email</h3>
                  <p>contacto@misitio.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icono" aria-hidden="true">04</div>
                <div>
                  <h3>Horarios de atención</h3>
                  <p>Lunes a Viernes de 9:00 a 18:00 hs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contacto-form">
            <p className="contacto-section-kicker">ESTAMOS PARA ESCUCHARTE</p>
            <h2>Envianos un mensaje</h2>
            <p className="contacto-form-intro">Dejanos tus datos y contanos cómo podemos ayudarte.</p>

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

      <footer className="contacto-footer">
        <p>© 2026 Clínica. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default Contacto;