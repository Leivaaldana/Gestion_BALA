import './Principal.css'

function Home() {
  const handleClick = () => {
    alert('¡Vamos!')
  }

  const features = [
    {
      icon: '⚡',
      title: 'Rápido',
      text: 'Todo funciona sin recargar la página, gracias a React.',
    },
    {
      icon: '🎨',
      title: 'Personalizable',
      text: 'Cada componente tiene su propio CSS, fácil de modificar.',
    },
    {
      icon: '🔒',
      title: 'Seguro',
      text: 'Preparado para conectarse a un backend con autenticación.',
    },
  ]

  return (
    <div className="home-container">
      <section className="home-hero">
        <h1 className="home-title">Bienvenido a MiApp</h1>
        <p className="home-subtitle">
          Esta es la página principal de tu proyecto. Desde acá podés navegar
          a las demás secciones del sitio.
        </p>
        <button className="home-cta" onClick={handleClick}>
          Empezar
        </button>
      </section>

      <section className="home-cards">
        {features.map((feature, index) => (
          <div className="home-card" key={index}>
            <div className="home-card-icon">{feature.icon}</div>
            <h3 className="home-card-title">{feature.title}</h3>
            <p className="home-card-text">{feature.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Home