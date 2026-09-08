import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-logo">MiApp</div>
      <nav className="header-nav">
        <a href="/">Inicio</a>
        <a href="/contacto">Contacto</a>
      </nav>
    </header>
  )
}

export default Header