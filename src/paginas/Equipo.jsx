import { Link } from "react-router-dom";
import familia from "../assets/blake-meyer-CRNbHjNaljo-unsplash.jpg";
import interior from "../assets/sibtain-ali-9zRDsfUQ0bo-unsplash.jpg";
import "../estilos/Institucionales.css";

const areas = [
  { numero: "01", nombre: "Clínica médica", descripcion: "Una mirada integral para acompañar la salud en cada etapa." },
  { numero: "02", nombre: "Cardiología", descripcion: "Atención enfocada en el cuidado y seguimiento cardiovascular." },
  { numero: "03", nombre: "Pediatría", descripcion: "Acompañamiento para niñas, niños y sus familias." },
  { numero: "04", nombre: "Enfermería", descripcion: "Cuidado cercano y apoyo durante la atención." },
];

export default function Equipo() {
  return (
    <main className="institutional-page team-page">
      <section className="team-hero">
        <div className="team-hero-copy">
          <p className="inst-kicker">PERSONAS QUE CUIDAN <span>·</span> NEUQUÉN</p>
          <h1>La salud se<br />construye <em>en equipo.</em></h1>
          <p className="inst-lead">
            Detrás de cada consulta hay escucha, conocimiento y muchas personas trabajando en conjunto.
          </p>
          <Link className="inst-button" to="/contacto">Conectá con nosotros <span>↗</span></Link>
          <div className="team-handwritten">CUIDAR<br />ES ESTAR.</div>
        </div>
        <div className="team-hero-photo">
          <img src={familia} alt="Profesional de salud conversando con una familia" />
          <span>UNA CONVERSACIÓN, UN PRIMER PASO.</span>
        </div>
        <div className="team-side-note">ATENCIÓN<br />CON<br />PERSPECTIVA<br />HUMANA</div>
      </section>

      <section className="team-manifesto">
        <span className="manifesto-mark">“</span>
        <p>La tecnología organiza el camino.<br /><strong>Las personas hacen la diferencia.</strong></p>
        <span className="manifesto-sign">CLÍNICA B.A.L.A. — NUESTRO COMPROMISO</span>
      </section>

      <section className="team-areas">
        <div className="team-areas-heading">
          <div>
            <p className="inst-kicker">UNA RED, MUCHAS MIRADAS</p>
            <h2>Áreas que<br />trabajan juntas.</h2>
          </div>
          <p>Estas son algunas de las áreas representadas en la plataforma. Cada proceso se apoya en la coordinación entre profesionales y equipos de atención.</p>
        </div>
        <div className="area-list">
          {areas.map((area) => (
            <article className="area-row" key={area.numero}>
              <span>{area.numero}</span>
              <h3>{area.nombre}</h3>
              <p>{area.descripcion}</p>
              <span className="area-plus" aria-hidden="true">+</span>
            </article>
          ))}
        </div>
      </section>

      <section className="team-photo-strip">
        <img src={interior} alt="Luz natural en un espacio de atención hospitalaria" loading="lazy" />
        <div className="photo-strip-caption"><span>ESPACIOS PARA ACOMPAÑAR</span><strong>Un lugar para cada paso.</strong></div>
      </section>

      <section className="inst-bottom-cta">
        <span className="inst-kicker">ESTAMOS PARA VOS</span>
        <h2>Conocernos también<br />es el comienzo.</h2>
        <Link className="inst-button inst-button-dark" to="/contacto">Escribinos <span>↗</span></Link>
      </section>
    </main>
  );
}
