import { Navigate, Outlet } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";

// Guarda de acceso para los paneles internos.
// Uso: <Route element={<RutaProtegida rol="medico" />}> ...rutas del médico... </Route>
export default function RutaProtegida({ rol }) {
  const { user } = useAuth();

  // Sin sesión: al login
  if (!user) return <Navigate to="/login" replace />;

  // Con sesión pero de otro rol: lo mandamos a SU panel
  if (user.rol !== rol) return <Navigate to={ROLE_HOME[user.rol]} replace />;

  return <Outlet />;
}
