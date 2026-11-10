import { Link } from "react-router-dom";
import hospital from "../assets/sibtain-ali-9zRDsfUQ0bo-unsplash.jpg";
import "../estilos/Institucionales.css";

const dudas = [
  {
    pregunta: "¿Cómo saco un turno?",
    respuesta: "Ingresá a tu cuenta y abrí Turnos. Elegí la especialidad, el profesional, el día y un horario disponible.",
  },
  {
    pregunta: "¿Dónde veo mis turnos?",
    respuesta: "Una vez que inicies sesión, la sección Turnos muestra tus reservas y su estado.",
  },
  {
    pregunta: "¿Cómo consulto mi historia clínica o mis estudios?",
    respuesta: "Iniciá sesión y entrá a Mi historial clínico o Repositorio de estudios desde el panel de paciente.",
  },
  {
    pregunta: "No puedo ingresar a mi cuenta. ¿Qué hago?",
    respuesta: "En la pantalla de inicio de sesión elegí “¿Olvidaste tu contraseña?” e ingresá el correo asociado a tu cuenta.",
  },
  {
    pregunta: "¿Tengo otra consulta?",
    respuesta: "Escribinos desde la página de Contacto. El equipo recibirá tu mensaje y podrá responder al correo que indiques.",
  },
];

export default function Asistencia() {
  return (
    <main className="institutional-page help-page">
      <section className="inst-hero help-hero">
        <div className="inst-hero-copy">
          <p className="inst-kicker">CENTRO DE AYUDA <span>01 / 03</span></p>
          <h1>Estamos para<br /><em>orientarte.</em></h1>
          <p className="inst-lead">
            Una guía rápida para resolver tus dudas y encontrar cada herramienta de B.A.L.A.
          </p>
          <Link className="inst-button" to="/contacto">Hablar con el equipo <span>↗</span></Link>
        </div>
        <div className="help-hero-image">
          <img src={hospital} alt="Espacio de atención dentro de un hospital" />
          <span className="image-stamp">CUIDADO<br />EN CADA<br />PASO</span>
          <span className="photo-caption">B.A.L.A. · ATENCIÓN CONECTADA</span>
        </div>
        <div className="hero-index">CENTRO<br /><strong>B.A.L.A.</strong></div>
      </section>

      <section className="help-shortcuts">
        <div className="inst-section-heading">
          <p className="inst-kicker">ENCONTRÁ TU CAMINO</p>
          <h2>¿Qué necesitás<br />resolver hoy?</h2>
        </div>
        <div className="shortcut-grid">
          <Link to="/paciente/turnos" className="shortcut-card">
            <span className="shortcut-number">01</span><span className="shortcut-arrow">↗</span>
            <h3>Gestionar turnos</h3><p>Reservas, horarios y estado de tus consultas.</p>
          </Link>
          <Link to="/paciente/historial" className="shortcut-card shortcut-card-light">
            <span className="shortcut-number">02</span><span className="shortcut-arrow">↗</span>
            <h3>Ver mi información</h3><p>Tu historia clínica y los datos de tu cuenta.</p>
          </Link>
          <Link to="/recuperar-contrasena" className="shortcut-card shortcut-card-blue">
            <span className="shortcut-number">03</span><span className="shortcut-arrow">↗</span>
            <h3>Recuperar acceso</h3><p>Restablecé tu contraseña desde tu correo.</p>
          </Link>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-heading">
          <p className="inst-kicker">RESPUESTAS CLARAS</p>
          <h2>Lo que más<br />nos preguntan<span>?</span></h2>
          <p>Si no encontrás lo que buscás, escribinos. Estamos para ayudarte.</p>
          <Link className="text-link-light" to="/contacto">Ir a contacto <span>↗</span></Link>
        </div>
        <div className="faq-list">
          {dudas.map((duda, index) => (
            <details className="faq-item" key={duda.pregunta}>
              <summary><span>0{index + 1}</span>{duda.pregunta}<b>+</b></summary>
              <p>{duda.respuesta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="inst-bottom-cta">
        <span className="inst-kicker">SIEMPRE CERCA</span>
        <h2>Tu próxima respuesta<br />empieza con un mensaje.</h2>
        <Link className="inst-button inst-button-dark" to="/contacto">Contactanos <span>↗</span></Link>
      </section>
    </main>
  );
}
