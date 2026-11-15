
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
  const [avisoCarta, setAvisoCarta] = useState(null);
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
    setAvisoCarta(null);

    try {
      await quitarCarta(mazoId, carta.id);

      setMazo({
        ...mazo,
        cartas: mazo.cartas.filter((c) => c.id !== carta.id),
      });

      setCartaVista(null);
    } catch (err) {
      setAvisoCarta({
        texto: mensajeDeError(err),
        tipo: 'error',
      });
    }
  }

  async function cambiarCantidad(carta, nueva) {
    if (nueva < 1) return quitar(carta);

    setAvisoCarta(null);

    try {
      const actualizada = await actualizarCantidad(
        mazoId,
        carta.id,
        nueva
      );

      setMazo({
        ...mazo,
        cartas: mazo.cartas.map((c) =>
          c.id === carta.id ? actualizada : c
        ),
      });
    } catch (err) {
      setAvisoCarta({
        texto: mensajeDeError(err),
        tipo: 'error',
      });
    }
  }

  async function agregar(carta) {
    const existente = mazo.cartas.find((c) =>
      carta.oracle_id && c.oracle_id
        ? c.oracle_id === carta.oracle_id
        : c.scryfall_id === carta.scryfall_id
    );

    if (existente) {
      if (!existente.es_basica) {
        setAvisoCarta({
          texto: 'Esta carta ya está en el mazo.',
          tipo: 'error',
        });
        return;
      }

      setAvisoCarta(null);

      return cambiarCantidad(
        existente,
        existente.cantidad + 1
      );
    }

    setAvisoCarta(null);

    try {
      const nueva = await agregarCarta(mazoId, carta);

      setMazo({
        ...mazo,
        cartas: [...mazo.cartas, nueva],
      });

      setAvisoCarta({
        texto: '¡Carta agregada correctamente!',
        tipo: 'exito',
      });
    } catch (err) {
      setAvisoCarta({
        texto: mensajeDeError(err),
        tipo: 'error',
      });
    }
  }

  if (cargando) {
    return <p className="apagado">Cargando mazo...</p>;
  }

  if (error) {
    return (
      <div className="aviso-error">
        <span>{error}</span>

        <button className="secundario" onClick={cargarMazo}>
          Reintentar
        </button>

        <button className="secundario" onClick={onVolver}>
          Volver
        </button>
      </div>
    );
  }

  const hayComandante = Boolean(mazo.comandante_scryfall_id);

  const total =
    mazo.cartas.reduce(
      (suma, carta) => suma + carta.cantidad,
      0
    ) + (hayComandante ? 1 : 0);

  const categorias = [
    { nombre: 'Comandantes', tipo: 'comandante' },
    { nombre: 'Criaturas', tipo: 'Creature' },
    { nombre: 'Planeswalkers', tipo: 'Planeswalker' },
    { nombre: 'Artefactos', tipo: 'Artifact' },
    { nombre: 'Encantamientos', tipo: 'Enchantment' },
    { nombre: 'Instantáneos', tipo: 'Instant' },
    { nombre: 'Conjuros', tipo: 'Sorcery' },
    { nombre: 'Tierras', tipo: 'Land' },
    { nombre: 'Otros', tipo: 'otros' },
  ];

  const cartasOrdenadas = [...mazo.cartas].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  );

  function obtenerCategoria(carta) {
    const tipo = carta.tipo || '';

    if (tipo.includes('Creature')) return 'Creature';
    if (tipo.includes('Planeswalker')) return 'Planeswalker';
    if (tipo.includes('Artifact')) return 'Artifact';
    if (tipo.includes('Enchantment')) return 'Enchantment';
    if (tipo.includes('Instant')) return 'Instant';
    if (tipo.includes('Sorcery')) return 'Sorcery';
    if (tipo.includes('Land')) return 'Land';

    return 'otros';
  }

  const grupos = categorias.map((categoria) => ({
    ...categoria,
    cartas: cartasOrdenadas.filter((carta) =>
      categoria.tipo === 'comandante'
        ? false
        : obtenerCategoria(carta) === categoria.tipo
    ),
  }));

  const nombresColores = {
    W: 'Blanco',
    U: 'Azul',
    B: 'Negro',
    R: 'Rojo',
    G: 'Verde',
  };

  return (
    <section>
      <div className="cabecera-seccion">
        <div>
          <h1>{mazo.nombre}</h1>

          <p className="meta">
            <span className="formato">{mazo.formato}</span>
            {' · '}
            {total} / {LIMITE_MAZO} cartas
          </p>

          {hayComandante && (
            <div className="comandante-linea">
              <p
                className="meta"
                onMouseEnter={() =>
                  setCartaVista({
                    nombre: mazo.comandante_nombre,
                    imagen: mazo.comandante_imagen,
                  })
                }
                onMouseLeave={() => setCartaVista(null)}
              >
                Comandante: {mazo.comandante_nombre}
              </p>

              <div className="identidad-comandante">
                <span>Identidad de color:</span>

                <div className="simbolos-colores">
                  {mazo.comandante_colores?.length > 0 ? (
                    mazo.comandante_colores.map((color) => (
                      <span
                        key={color}
                        className={`simbolo-color color-${color}`}
                        title={nombresColores[color]}
                      >
                        {color}
                      </span>
                    ))
                  ) : (
                    <span>Incoloro</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="secundario" onClick={onVolver}>
          Volver a mis mazos
        </button>
      </div>

      <div className="detalle-mazo">
        <div>
          <h2 className="subtitulo">Cartas del mazo</h2>

          {cartasOrdenadas.length === 0 ? (
            <p className="apagado">
              Este mazo aún no tiene cartas. Búscalas más abajo.
            </p>
          ) : (
            <div className="categorias-mazo">
              {grupos
                .filter((grupo) => grupo.cartas.length > 0)
                .map((grupo) => (
                  <section
                    className="categoria-mazo"
                    key={grupo.tipo}
                  >
                    <h3>
                      {grupo.nombre}
                      <span>
                        {' '}
                        ({grupo.cartas.reduce(
                          (total, carta) => total + carta.cantidad,
                          0
                        )})
                      </span>
                    </h3>

                    <ul className="lista-cartas-mazo">
                      {grupo.cartas.map((carta) => (
                        <FilaCarta
                          key={carta.id}
                          carta={carta}
                          onVer={setCartaVista}
                          onQuitar={() => quitar(carta)}
                          onCambiarCantidad={(nueva) =>
                            cambiarCantidad(carta, nueva)
                          }
                        />
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          )}

          <h2 className="subtitulo">Buscar cartas</h2>

          <BuscadorCartas
            cartasEnMazo={mazo.cartas}
            onAgregar={agregar}
            onVer={setCartaVista}
          />
        </div>

        <aside className="vista-previa-lateral">
          {cartaVista?.imagen ? (
            <img
              src={cartaVista.imagen}
              alt={cartaVista.nombre}
            />
          ) : (
            <p className="apagado">
              Pasa el mouse sobre una carta para ver su imagen.
            </p>
          )}

          {avisoCarta && (
            <p className={`mensaje-carta ${avisoCarta.tipo}`}>
              {avisoCarta.texto}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default DetalleMazo;
