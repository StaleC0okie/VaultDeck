import { useState } from 'react';
import { haySesion, logout } from './api/auth';
import Login from './components/Login';
import ListaMazos from './components/ListaMazos';
import PaginaBuscar from './components/PaginaBuscar';
import Registro from './components/Registro';


function App() {
  const [autenticado, setAutenticado] = useState(haySesion());
  const [vista, setVista] = useState('buscar');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  function cerrarSesion() {
    logout();
    setAutenticado(false);
    setVista('buscar');
  }

function contenido() {
  if (vista === 'mazos') {
    if (autenticado) {
      return <ListaMazos />;
    }

    return mostrarRegistro ? (
      <Registro
        onRegistro={() => setMostrarRegistro(false)}
        onVolver={() => setMostrarRegistro(false)}
      />
    ) : (
      <Login
        onLogin={() => setAutenticado(true)}
        onRegistro={() => setMostrarRegistro(true)}
      />
    );
  }

  return <PaginaBuscar />;
}

  return (
    <div>
      <header className="barra">
        <div className="barra-izq">
          <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}></div>
          <span className="logo">VaultDeck</span>
          <nav className="nav">
            <button
              className={vista === 'buscar' ? 'nav-btn activo' : 'nav-btn'}
              onClick={() => setVista('buscar')}
            >
              Buscar cartas
            </button>
            <button
              className={vista === 'mazos' ? 'nav-btn activo' : 'nav-btn'}
              onClick={() => setVista('mazos')}
            >
              Mis mazos
            </button>
          </nav>
        </div>
        {autenticado ? (
          <button className="secundario" onClick={cerrarSesion}>Cerrar sesión</button>
        ) : (
          <button className="secundario" onClick={() => setVista('mazos')}>Ingresar</button>
        )}
      </header>

      <main className="contenido">{contenido()}</main>

      <footer className="pie">
          Wizards of the Coast, Magic: The Gathering, and their logos are trademarks
          of Wizards of the Coast LLC in the United States and other countries.
          © 1993-2026 Wizards. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;