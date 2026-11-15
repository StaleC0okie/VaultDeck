
import { useState } from 'react';
import { registro } from '../api/auth';

function Registro({ onRegistro, onVolver }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      await registro(username, email, password, password2);
      onRegistro();
    } catch (err) {
      if (!err.response) {
        setError('No se pudo conectar con el servidor.');
      } else {
        const errores = err.response.data;
        setError(
          errores.username?.[0] ||
          errores.email?.[0] ||
          errores.password?.[0] ||
          errores.password2?.[0] ||
          errores.non_field_errors?.[0] ||
          'No se pudo crear la cuenta.'
        );
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className="login" onSubmit={manejarEnvio}>
      <h1>Crear cuenta</h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
        required
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />

      <input
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="Repetir contraseña"
        required
      />

      <button type="submit" disabled={cargando}>
        {cargando ? 'Registrando...' : 'Registrarse'}
      </button>

      {error && <p className="error">{error}</p>}

      <button type="button" onClick={onVolver}>
        Volver al inicio de sesión
      </button>
    </form>
  );
}

export default Registro;
