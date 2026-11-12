import { useEffect, useState } from 'react';
import { agregarCarta, obtenerMazo, quitarCarta } from '../api/mazos';
import { mensajeDeError } from '../api/errores';
import BuscadorCartas from './BuscadorCartas';
import TarjetaCarta from './TarjetaCarta';

function DetalleMazo({ mazoId, onVolver }) {
  const [mazo, setMazo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

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

  async function agregar(carta) {
    setAviso('');
    try {
      const nueva = await agregarCarta(mazoId, carta);
      setMazo({ ...mazo, cartas: [...mazo.cartas, nueva] });
    } catch (err) {
      setAviso(mensajeDeError(err));
    }
  }

  async function quitar(carta) {
    setAviso('');
    try {
      await quitarCarta(mazoId, carta.id);
      setMazo({ ...mazo, cartas: mazo.cartas.filter((c) => c.id !== carta.id) });
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

  const total = mazo.cartas.reduce((suma, carta) => suma + carta.cantidad, 0);
  const idsEnMazo = mazo.cartas.map((carta) => carta.scryfall_id);

  return (
    <section>
      <div className="cabecera-seccion">
        <div>
          <h1>{mazo.nombre}</h1>
          <p className="meta">
            <span className="formato">{mazo.formato}</span> · {total} cartas
          </p>
        </div>
        <button className="secundario" onClick={onVolver}>Volver a mis mazos</button>
      </div>

      {aviso && <p className="error">{aviso}</p>}

      <h2 className="subtitulo">Cartas del mazo</h2>
      {mazo.cartas.length === 0 && (
        <p className="apagado">Este mazo aún no tiene cartas. Búscalas más abajo.</p>
      )}
      <div className="grid-cartas">
        {mazo.cartas.map((carta) => (
          <TarjetaCarta
            key={carta.id}
            carta={carta}
            textoBoton="Quitar"
            onAccion={() => quitar(carta)}
          />
        ))}
      </div>

      <h2 className="subtitulo">Buscar cartas</h2>
      <BuscadorCartas idsEnMazo={idsEnMazo} onAgregar={agregar} />
    </section>
  );
}

export default DetalleMazo;