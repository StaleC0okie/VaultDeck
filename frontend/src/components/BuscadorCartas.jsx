
import { useState } from 'react';
import { buscarCartas } from '../api/scryfall';
import TarjetaCarta from './TarjetaCarta';

function BuscadorCartas({
  cartasEnMazo = [],
  onAgregar,
  onVer,
  avisoCarta,
}) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState('');

  async function manejarBusqueda(evento) {
    evento.preventDefault();
    const consulta = texto.trim();
    if (!consulta) return;

    setBuscando(true);
    setError('');

    try {
      const cartas = await buscarCartas(consulta);
      setResultados(cartas);
      setBuscado(true);
    } catch (err) {
      setResultados([]);
      setError(err.message);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div>
      <form className="buscador-cartas" onSubmit={manejarBusqueda}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar carta ej: Sello Arcano"
        />
        <button type="submit" disabled={buscando}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {buscado && !buscando && !error && resultados.length === 0 && (
        <p className="apagado">No se encontraron cartas.</p>
      )}

      <div className="grid-cartas">
        {resultados.map((carta) => {
          const yaEnMazo = cartasEnMazo.some(
            (existente) => existente.oracle_id === carta.oracle_id
          );

          let textoBoton;

          if (onAgregar) {
            if (!yaEnMazo) {
              textoBoton = 'Agregar';
            } else {
              textoBoton = carta.es_basica
                ? 'Agregar otra'
                : 'En el mazo';
            }
          }

          const mensaje =
            avisoCarta?.id === carta.scryfall_id
              ? avisoCarta
              : null;

          return (
            <TarjetaCarta
              key={carta.scryfall_id}
              carta={carta}
              textoBoton={textoBoton}
              deshabilitado={yaEnMazo && !carta.es_basica}
              onAccion={() => onAgregar?.(carta)}
              onVer={onVer}
              mensaje={mensaje}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BuscadorCartas;
