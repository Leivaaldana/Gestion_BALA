import { Link } from "react-router-dom";
import clinica from "../assets/national-cancer-institute-1c8sj2IO2I4-unsplash.jpg";
import edificio from "../assets/jason-hu-9_4CdmYYEjc-unsplash.jpg";
import "../estilos/Institucionales.css";

const novedades = [
  {
    numero: "01",
    categoria: "SERVICIOS DIGITALES",
    titulo: "Tus turnos, más cerca",
    texto: "Consultá especialidades, elegí un horario y revisá el estado de tus reservas desde tu cuenta.",
    imagen: edificio,
    alt: "Edificio hospitalario iluminado al atardecer",
    clase: "announcement-feature",
  },
  {
    numero: "02",
    categoria: "TU INFORMACIÓN",
    titulo: "Un espacio para tu historia",
    texto: "Accedé a la información clínica y a tus estudios desde las secciones habilitadas para pacientes.",
    imagen: clinica,
    alt: "Profesional de salud conversando con una familia",
    clase: "",
  },
  {
    numero: "03",
    categoria: "ACOMPAÑAMIENTO",
    titulo: "Estamos para responder",
    texto: "El formulario de contacto conecta tus consultas con el equipo para que pueda darles seguimiento.",
    imagen: null,
    alt: "",
    clase: "announcement-text-only",
  },
];

export default function Anuncios() {
  return (
    <main className="institutional-page news-page">
      <section className="news-masthead">
        <div className="news-masthead-top">
          <span className="inst-kicker">B.A.L.A. / INFORMACIÓN</span>
          <span className="news-edition">EDICIÓN ABIERTA · ACTUALIZACIONES DEL SISTEMA</span>
        </div>
        <div className="news-title-row">
          <h1>Novedades<br /><em>que te acercan.</em></h1>
          <p>Información sobre herramientas, servicios y formas de estar en contacto con la clínica.</p>
        </div>
        <div className="news-cover">
          <img src={clinica} alt="Atención médica en una consulta" />
          <div className="news-cover-label">
            <span>EN EL CENTRO</span>
            <strong>Tu cuidado.<br />Tu información.<br />A tu alcance.</strong>
            <Link to="/paciente/turnos">Conocé el portal <span>↗</span></Link>
          </div>
          <span className="news-cover-index">B.A.L.A. / 2026</span>
        </div>
      </section>

      <section className="news-feed">
        <div className="feed-heading">
          <p className="inst-kicker">LO QUE PODÉS HACER</p>
          <h2>Herramientas para<br />acompañarte mejor.</h2>
          <p>Conocé las funciones disponibles en la plataforma.</p>
        </div>
        <div className="announcement-grid">
          {novedades.map((novedad) => (
            <article className={`announcement-card ${novedad.clase}`} key={novedad.numero}>
              {novedad.imagen && (
                <div className="announcement-image">
                  <img src={novedad.imagen} alt={novedad.alt} loading="lazy" />
                </div>
              )}
              <div className="announcement-body">
                <div className="announcement-meta"><span>{novedad.categoria}</span><b>{novedad.numero}</b></div>
                <h3>{novedad.titulo}</h3>
                <p>{novedad.texto}</p>
                {novedad.numero === "01" && <Link to="/paciente/turnos">Ir a turnos <span>↗</span></Link>}
                {novedad.numero === "02" && <Link to="/paciente/historial">Mi historial <span>↗</span></Link>}
                {novedad.numero === "03" && <Link to="/contacto">Escribirnos <span>↗</span></Link>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="news-banner">
        <div className="news-banner-image">
          <img src={edificio} alt="Hospital al caer la tarde" loading="lazy" />
        </div>
        <div className="news-banner-copy">
          <span className="inst-kicker">¿TENÉS UNA CONSULTA?</span>
          <h2>La información<br />también es cuidado.</h2>
          <p>Escribinos y nuestro equipo te orientará sobre cómo continuar.</p>
          <Link className="text-link-light" to="/asistencia">Visitar asistencia <span>↗</span></Link>
        </div>
      </section>
    </main>
  );
}
