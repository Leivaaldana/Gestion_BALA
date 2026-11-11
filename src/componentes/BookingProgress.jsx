import "./BookingProgress.css";

const pasos = ["Elegir reservar", "Iniciar sesión", "Reservar turno"];

export default function BookingProgress({ step, complete = false }) {
  const progreso = complete ? 100 : ((step - 1) / pasos.length) * 100;
  const progresoRedondeado = Math.round(progreso);

  return (
    <div className="booking-progress">
      <div
        className="booking-progress__meter"
        role="progressbar"
        aria-label="Progreso para reservar un turno"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progresoRedondeado}
      >
        <span style={{ width: `${progresoRedondeado}%` }} />
      </div>
      <ol className="booking-progress__steps">
        {pasos.map((paso, index) => {
          const numero = index + 1;
          const terminado = complete || numero < step;
          const actual = !complete && numero === step;

          return (
            <li
              className={`booking-progress__step${terminado ? " is-complete" : ""}${actual ? " is-current" : ""}`}
              aria-current={actual ? "step" : undefined}
              key={paso}
            >
              <span className="booking-progress__number" aria-hidden="true">
                {terminado ? "✓" : `0${numero}`}
              </span>
              <span>{paso}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
