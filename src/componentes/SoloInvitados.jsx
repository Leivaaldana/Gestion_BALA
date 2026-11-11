import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";

// Para /login y /registro: si ya hay sesión, no tiene sentido mostrarlos.
export default function SoloInvitados() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const destinoReserva = location.state?.bookingFlow && user.rol === "paciente";
    return (
      <Navigate
        to={destinoReserva ? "/paciente/turnos" : ROLE_HOME[user.rol]}
        replace
        state={destinoReserva ? { bookingFlow: true } : undefined}
      />
    );
  }

  return <Outlet />;
}
