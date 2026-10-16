import './App.css'
import { Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./componentes/Layout.jsx";
import DashboardLayout from "./componentes/DashboardLayout.jsx";

// Páginas públicas
import Principal from "./paginas/Principal.jsx";
import Login from "./paginas/Login.jsx";
import Registro from "./paginas/Registro.jsx"; // ajustá el nombre si tu archivo se llama distinto
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
    <Routes>
      {/* Un solo Layout (con el header) para todo el sitio */}
      <Route element={<Layout />}>

        {/* Públicas */}
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Paciente */}
        <Route element={<DashboardLayout role="paciente" />}>
          <Route path="/paciente/historial" element={<MiHistorialClinico />} />
          <Route path="/paciente/turnos" element={<Turnos />} />
          <Route path="/paciente/estudios" element={<RepositorioEstudios />} />
        </Route>

        {/* Médico */}
        <Route element={<DashboardLayout role="medico" />}>
          <Route path="/medico/historia" element={<GestionHistoriaClinica />} />
          <Route path="/medico/guardias" element={<ControlGuardias />} />
          <Route path="/medico/derivacion" element={<DerivacionInternacion />} />
          <Route path="/medico/prescripciones" element={<SistemaPrescripciones />} />
        </Route>

        {/* Enfermera */}
        <Route element={<DashboardLayout role="enfermera" />}>
          <Route path="/enfermera/medicacion" element={<SuministroMedicacion />} />
          <Route path="/enfermera/guardias" element={<ControlGuardiasEnfermera />} />
          <Route path="/enfermera/insumos" element={<GestionInsumos />} />
        </Route>

        {/* Administrativo */}
        <Route element={<DashboardLayout role="administrativo" />}>
          <Route path="/administrativo/altas" element={<RegistroAltas />} />
          <Route path="/administrativo/camas" element={<GestionCamas />} />
          <Route path="/administrativo/agenda" element={<GestionAgenda />} />
        </Route>

        {/* Directivos */}
        <Route element={<DashboardLayout role="directivos" />}>
          <Route path="/directivos/recursos" element={<PanelRecursos />} />
          <Route path="/directivos/analisis" element={<AnalisisDatos />} />
          <Route path="/directivos/auditoria" element={<SupervisionAuditoria />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;