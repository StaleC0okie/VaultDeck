import { useEffect, useState } from 'react';
import {
  actualizarCantidad,
  agregarCarta,
  obtenerMazo,
  quitarCarta,
} from '../api/mazos';
import { mensajeDeError } from '../api/errores';
import BuscadorCartas from './BuscadorCartas';
import FilaCarta from './FilaCarta';

const LIMITE_MAZO = 100;

function DetalleMazo({ mazoId, onVolver }) {
  const [mazo, setMazo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cartaVista, setCartaVista] = useState(null);

  async function cargarMazo() {
    setCargando(true);
    setError('');
    try {
      setMazo(await obtenerMazo(mazoId));
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarMazo();
  }, [mazoId]);

  async function quitar(carta) {
    setAviso('');
    try {
      await quitarCarta(mazoId, carta.id);
      setMazo({ ...mazo, cartas: mazo.cartas.filter((c) => c.id !== carta.id) });
      setCartaVista(null);
    } catch (err) {
      setAviso(mensajeDeError(err));
    }
  }

  async function cambiarCantidad(carta, nueva) {
    if (nueva < 1) return quitar(carta);
    setAviso('');
    try {
      const actualizada = await actualizarCantidad(mazoId, carta.id, nueva);
      setMazo({
        ...mazo,
        cartas: mazo.cartas.map((c) => (c.id === carta.id ? actualizada : c)),
      });
    } catch (err) {
      setAviso(mensajeDeError(err));
    }
  }

  async function agregar(carta) {
    const existente = mazo.cartas.find((c) => c.scryfall_id === carta.scryfall_id);
    if (existente) return cambiarCantidad(existente, existente.cantidad + 1);

    setAviso('');
    try {
      const nueva = await agregarCarta(mazoId, carta);
      setMazo({ ...mazo, cartas: [...mazo.cartas, nueva] });
    } catch (err) {
      setAviso(mensajeDeError(err));
    }
  }

  if (cargando) return <p className="apagado">Cargando mazo...</p>;

  if (error) {
    return (
      <div className="aviso-error">
        <span>{error}</span>
        <button className="secundario" onClick={cargarMazo}>Reintentar</button>
        <button className="secundario" onClick={onVolver}>Volver</button>
      </div>
    );
  }
  const hayComandante = Boolean(mazo.comandante_scryfall_id);
  const total =
    mazo.cartas.reduce((suma, carta) => suma + carta.cantidad, 0) + (hayComandante ? 1 : 0);
  const idsEnMazo = mazo.cartas.map((carta) => carta.scryfall_id);
  const ordenadas = [...mazo.cartas].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  return (
    <section>
      <div className="cabecera-seccion">
        <div>
          <h1>{mazo.nombre}</h1>
          <p className="meta">
            <span className="formato">{mazo.formato}</span> · {total} / {LIMITE_MAZO} cartas
          </p>
          {hayComandante && (
            <p
              className="meta comandante-linea"
              onMouseEnter={() =>
                setCartaVista({ nombre: mazo.comandante_nombre, imagen: mazo.comandante_imagen })
              }
              onMouseLeave={() => setCartaVista(null)}
            >
              Comandante: {mazo.comandante_nombre}
            </p>
          )}
        </div>
        <button className="secundario" onClick={onVolver}>Volver a mis mazos</button>
      </div>

      {aviso && <p className="error">{aviso}</p>}

      <div className="detalle-mazo">
        <div>
          <h2 className="subtitulo">Cartas del mazo</h2>
          {ordenadas.length === 0 ? (
            <p className="apagado">Este mazo aún no tiene cartas. Búscalas más abajo.</p>
          ) : (
            <ul className="lista-cartas-mazo">
              {ordenadas.map((carta) => (
                <FilaCarta
                  key={carta.id}
                  carta={carta}
                  onVer={setCartaVista}
                  onQuitar={() => quitar(carta)}
                  onCambiarCantidad={(nueva) => cambiarCantidad(carta, nueva)}
                />
              ))}
            </ul>
          )}

          <h2 className="subtitulo">Buscar cartas</h2>
          <BuscadorCartas idsEnMazo={idsEnMazo} onAgregar={agregar} />
        </div>

        <aside className="vista-previa-lateral">
          {cartaVista?.imagen ? (
            <img src={cartaVista.imagen} alt={cartaVista.nombre} />
          ) : (
            <p className="apagado">Pasa el mouse sobre una carta para ver su imagen.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default DetalleMazo;