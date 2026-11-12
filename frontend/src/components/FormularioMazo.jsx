import { useState } from 'react';
import { mensajeDeError } from '../api/errores';

function FormularioMazo({ mazo, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(mazo?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(mazo?.descripcion ?? '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await onGuardar({ nombre, formato: 'commander', descripcion });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-mazo" onSubmit={manejarEnvio}>
      <h2>{mazo ? 'Editar mazo' : 'Nuevo mazo'}</h2>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del mazo"
      />
      <p className="apagado">Formato: Commander</p>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        rows={3}
      />
      {error && <p className="error">{error}</p>}
      <div className="acciones">
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioMazo;