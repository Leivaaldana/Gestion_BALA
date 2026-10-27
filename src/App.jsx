import "./App.css";
import { Routes, Route } from "react-router-dom";

// Header único
import Nav from "./componentes/Nav.jsx";

// Layout del menú lateral + guardas de acceso
import DashboardLayout from "./componentes/DashboardLayout.jsx";
import RutaProtegida from "./componentes/RutaProtegida.jsx";
import SoloInvitados from "./componentes/SoloInvitados.jsx";

// Páginas públicas
import Principal from "./paginas/Principal.jsx";
import Login from "./paginas/Login.jsx";
import Registro from "./paginas/Registro.jsx"; // ajustá si tu archivo se llama distinto
import Contacto from "./paginas/Contactos.jsx";

// Paciente
import MiHistorialClinico from "./paginas/paciente/MiHistorialClinico.jsx";
import Turnos from "./paginas/paciente/Turnos.jsx";
import RepositorioEstudios from "./paginas/paciente/RepositorioEstudios.jsx";

// Médico
import GestionHistoriaClinica from "./paginas/medico/GestionHistoriaClinica.jsx";
import ControlGuardias from "./paginas/medico/ControlGuardias.jsx";
import DerivacionInternacion from "./paginas/medico/DerivacionInternacion.jsx";
import SistemaPrescripciones from "./paginas/medico/SistemaPrescripciones.jsx";

// Enfermera
import SuministroMedicacion from "./paginas/enfermera/SuministroMedicacion.jsx";
import ControlGuardiasEnfermera from "./paginas/enfermera/ControlGuardiasEnfermera.jsx";
import GestionInsumos from "./paginas/enfermera/GestionInsumos.jsx";

// Administrativo
import RegistroAltas from "./paginas/administrativo/RegistroAltas.jsx";
import GestionCamas from "./paginas/administrativo/GestionCamas.jsx";
import GestionAgenda from "./paginas/administrativo/GestionAgenda.jsx";

// Directivos
import PanelRecursos from "./paginas/directivos/PanelRecursos.jsx";
import AnalisisDatos from "./paginas/directivos/AnalisisDatos.jsx";
import SupervisionAuditoria from "./paginas/directivos/SupervisionAuditoria.jsx";

function App() {
  return (
    <>
      <Nav />

      <Routes>
        {/* Públicas (se ven con o sin sesión) */}
        <Route path="/" element={<Principal />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* Más adelante: /equipo, /anuncios, /asistencia */}

        {/* Solo sin sesión: si ya iniciaste, te manda a tu panel */}
        <Route element={<SoloInvitados />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        {/* Paciente */}
        <Route element={<RutaProtegida rol="paciente" />}>
          <Route element={<DashboardLayout role="paciente" />}>
            <Route path="/paciente/historial" element={<MiHistorialClinico />} />
            <Route path="/paciente/turnos" element={<Turnos />} />
            <Route path="/paciente/estudios" element={<RepositorioEstudios />} />
          </Route>
        </Route>

        {/* Médico */}
        <Route element={<RutaProtegida rol="medico" />}>
          <Route element={<DashboardLayout role="medico" />}>
            <Route path="/medico/historia" element={<GestionHistoriaClinica />} />
            <Route path="/medico/guardias" element={<ControlGuardias />} />
            <Route path="/medico/derivacion" element={<DerivacionInternacion />} />
            <Route path="/medico/prescripciones" element={<SistemaPrescripciones />} />
          </Route>
        </Route>

        {/* Enfermera */}
        <Route element={<RutaProtegida rol="enfermera" />}>
          <Route element={<DashboardLayout role="enfermera" />}>
            <Route path="/enfermera/medicacion" element={<SuministroMedicacion />} />
            <Route path="/enfermera/guardias" element={<ControlGuardiasEnfermera />} />
            <Route path="/enfermera/insumos" element={<GestionInsumos />} />
          </Route>
        </Route>

        {/* Administrativo */}
        <Route element={<RutaProtegida rol="administrativo" />}>
          <Route element={<DashboardLayout role="administrativo" />}>
            <Route path="/administrativo/altas" element={<RegistroAltas />} />
            <Route path="/administrativo/camas" element={<GestionCamas />} />
            <Route path="/administrativo/agenda" element={<GestionAgenda />} />
          </Route>
        </Route>

        {/* Directivos */}
        <Route element={<RutaProtegida rol="directivos" />}>
          <Route element={<DashboardLayout role="directivos" />}>
            <Route path="/directivos/recursos" element={<PanelRecursos />} />
            <Route path="/directivos/analisis" element={<AnalisisDatos />} />
            <Route path="/directivos/auditoria" element={<SupervisionAuditoria />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
