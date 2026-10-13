import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../estilos/Dashboard.css";

export default function DashboardLayout({ role }) {
  return (
    <div className="dashboard-shell">
      <Sidebar role={role} />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
