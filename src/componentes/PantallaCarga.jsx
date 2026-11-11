import logo from "../assets/Logotipo.jpeg";
import "../estilos/PantallaCarga.css";

export default function PantallaCarga({ mensaje = "Estamos preparando tu espacio" }) {
  return (
    <div className="pantalla-carga" role="status" aria-live="polite">
      <div className="pantalla-carga-contenido">
        <div className="pantalla-carga-marca">
          <img src={logo} alt="" />
          <span aria-hidden="true">B.A.L.A.</span>
        </div>
        <div className="pantalla-carga-indicador" aria-hidden="true">
          <span />
        </div>
        <p className="pantalla-carga-mensaje">{mensaje}</p>
        <span className="pantalla-carga-pie">CLÍNICA · CUIDADO EN CADA PASO</span>
      </div>
    </div>
  );
}
