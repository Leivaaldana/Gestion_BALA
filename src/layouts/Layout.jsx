import { Outlet } from "react-router-dom";
import nav from "../componentes/nav";

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}