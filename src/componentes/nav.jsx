import React from 'react';

const Navbar = ({ userRole, userName }) => {
  const handleLogout = () => {
    // Lógica para borrar sesión
    console.log("Sesión finalizada");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{ backgroundColor: '#1a1a2e' }}>
      <div className="container-fluid px-4">
        {/* Logo y Nombre del Proyecto */}
        <a className="navbar-brand d-flex align-items-center" href="#!">
          <div 
            className="bg-white rounded-circle d-flex align-items-center justify-center me-2" 
            style={{ width: '40px', height: '40px', color: '#1a1a2e', textAlign: 'center', lineHeight: '40px' }}
          >
            <span className="fw-bold h4">+</span>
          </div>
          <span className="fw-bold">B.A.L.A. <small className="fw-light opacity-75">CLÍNICA</small></span>
        </a>

        {/* Botón para móviles */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido de la derecha */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="d-flex align-items-center">
            <div className="text-white text-end me-3 d-none d-md-block">
              <div className="small fw-bold">{userName || "Usuario"}</div>
              <div className="small text-info text-uppercase" style={{ fontSize: '0.7rem' }}>
                {userRole || "Invitado"}
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-danger btn-sm px-3"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
