import React from "react";
import "./Contacto.css";

function Contacto() {
  return (
    <div className="contacto-page">

      {/* ENCABEZADO */}
      <header className="contacto-header">
        <div className="logo">Mi Sitio</div>

        <nav>
          <a href="/">Inicio</a>
          <a href="/productos">Productos</a>
          <a href="/nosotros">Nosotros</a>
          <a href="/contacto" className="activo">Contacto</a>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="contacto-container">

        <section className="contacto-intro">
          <h1>Contactanos</h1>
          <p>
            ¿Tenés alguna consulta? Completá el formulario y nos pondremos
            en contacto con vos lo antes posible.
          </p>
        </section>

        <section className="contacto-content">

          {/* INFORMACIÓN */}
          <div className="contacto-info">
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
                <h3>Horarios</h3>
                <p>Lunes a Viernes de 9:00 a 18:00</p>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="contacto-form">
            <h2>Envianos un mensaje</h2>

            <form>
              <div className="form-row">
                <div className="campo">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="tuemail@gmail.com"
                  />
                </div>
              </div>

              <div className="campo">
                <label htmlFor="asunto">Asunto</label>
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
                  rows="6"
                  placeholder="Escribí tu mensaje..."
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
        <p>© 2026 Mi Sitio. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default Contacto;