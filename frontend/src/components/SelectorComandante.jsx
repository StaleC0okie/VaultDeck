import { useState } from 'react';
import { buscarCartas } from '../api/scryfall';

function SelectorComandante({ comandante, onElegir, permitirCambio }) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState('');

  async function buscar() {
    const consulta = texto.trim();
    if (!consulta) return;

    setBuscando(true);
    setError('');
    try {
      setResultados(await buscarCartas(consulta, 'is:commander'));
      setBuscado(true);
    } catch (err) {
      setResultados([]);
      setError(err.message);
    } finally {
      setBuscando(false);
    }
  }

  function alPresionarTecla(evento) {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      buscar();
    }
  }

  if (comandante) {
    return (
      <div className="comandante-elegido">
        {comandante.imagen && <img src={comandante.imagen} alt={comandante.nombre} />}
        <div>
          <p className="meta">Comandante</p>
          <p className="nombre-comandante">{comandante.nombre}</p>
          {permitirCambio && (
            <button type="button" className="secundario" onClick={() => onElegir(null)}>
              Cambiar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="selector-comandante">
      <p className="meta">Comandante (obligatorio)</p>
      <div className="buscador-cartas">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={alPresionarTecla}
          placeholder="Busca tu comandante (ej: Teval, the balanced scale)"
        />
        <button type="button" onClick={buscar} disabled={buscando}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {buscado && !buscando && !error && resultados.length === 0 && (
        <p className="apagado">No se encontraron comandantes con ese nombre.</p>
      )}

      <div className="grid-comandantes">
        {resultados.map((carta) => (
          <button
            type="button"
            key={carta.scryfall_id}
            className="opcion-comandante"
            onClick={() => onElegir(carta)}
          >
            {carta.imagen && <img src={carta.imagen} alt={carta.nombre} />}
            <span className="nombre-carta">{carta.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectorComandante;