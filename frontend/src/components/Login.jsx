import { useState } from 'react';
import { login } from '../api/auth';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      if (!err.response) {
        setError('No se pudo conectar con el servidor.');
      } else if (err.response.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else if (err.response.status === 400) {
        setError('Completa usuario y contraseña.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className="login" onSubmit={manejarEnvio}>
      <h1>Ingresar</h1>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit" disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Login;