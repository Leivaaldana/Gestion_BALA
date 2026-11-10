import React from "react";
import "../estilos/Contactos.css";

function Contacto() {
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

            <form>
              <div className="form-row">
                <div className="campo">
                  <label htmlFor="nombre">Nombre y Apellido</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Ej: María Pérez"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="tuemail@gmail.com"
                  />
                </div>
              </div>

              <div className="campo">
                <label htmlFor="asunto">Asunto / Motivo</label>
                <input
                  type="text"
                  id="asunto"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div className="campo">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  rows="5"
                  placeholder="Escribí tu consulta con confianza..."
                ></textarea>
              </div>

              <button type="submit">
                Enviar mensaje
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