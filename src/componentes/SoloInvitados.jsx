import { Navigate, Outlet } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";

// Para /login y /registro: si ya hay sesión, no tiene sentido mostrarlos.
export default function SoloInvitados() {
  const { user } = useAuth();

  if (user) return <Navigate to={ROLE_HOME[user.rol]} replace />;

  return <Outlet />;
}
