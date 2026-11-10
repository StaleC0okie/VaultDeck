import { useState } from 'react';
import { haySesion, logout } from './api/auth';
import Login from './components/Login';
import ListaMazos from './components/ListaMazos';

function App() {
  const [autenticado, setAutenticado] = useState(haySesion());

  function cerrarSesion() {
    logout();
    setAutenticado(false);
  }

  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />;
  }

  return (
    <div>
      <header className="barra">
        <span className="logo">VaultDeck</span>
        <button className="secundario" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>
      <main className="contenido">
        <ListaMazos />
      </main>
    </div>
  );
}

export default App;