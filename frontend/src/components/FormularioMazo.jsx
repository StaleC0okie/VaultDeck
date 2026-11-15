import { useState } from 'react';
import { mensajeDeError } from '../api/errores';
import SelectorComandante from './SelectorComandante';

function FormularioMazo({ mazo, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(mazo?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(mazo?.descripcion ?? '');
  const [comandante, setComandante] = useState(
    mazo?.comandante_scryfall_id
      ? {
          scryfall_id: mazo.comandante_scryfall_id,
          nombre: mazo.comandante_nombre,
          imagen: mazo.comandante_imagen,
          color_identity: mazo.comandante_colores,
        }
      : null
  );
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    if (!comandante) {
      setError('Elige un comandante para el mazo.');
      return;
    }

    setError('');
    setGuardando(true);
    try {
      await onGuardar({
        nombre,
        formato: 'commander',
        descripcion,
        comandante_scryfall_id: comandante.scryfall_id,
        comandante_nombre: comandante.nombre,
        comandante_imagen: comandante.imagen,
        comandante_colores: comandante.color_identity,
      });
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

      <SelectorComandante
        comandante={comandante}
        onElegir={setComandante}
        permitirCambio={!mazo}
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