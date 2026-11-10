import { useState } from 'react';
import { mensajeDeError } from '../api/errores';

const FORMATOS = ['commander', 'standard', 'modern', 'pioneer', 'legacy', 'pauper'];

function FormularioMazo({ mazo, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(mazo?.nombre ?? '');
  const [formato, setFormato] = useState(mazo?.formato ?? 'commander');
  const [descripcion, setDescripcion] = useState(mazo?.descripcion ?? '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await onGuardar({ nombre, formato, descripcion });
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
      <select value={formato} onChange={(e) => setFormato(e.target.value)}>
        {FORMATOS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
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