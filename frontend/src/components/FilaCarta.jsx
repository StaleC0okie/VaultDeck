function FilaCarta({ carta, onVer, onQuitar, onCambiarCantidad }) {
  return (
    <li
      className="fila-carta"
      onMouseEnter={() => onVer(carta)}
      onMouseLeave={() => onVer(null)}
      onFocus={() => onVer(carta)}
      onBlur={() => onVer(null)}
    >
      <span className="fila-nombre" title={carta.nombre}>{carta.nombre}</span>
      <span className="fila-controles">
        {carta.es_basica && (
          <>
            <button
              className="mini"
              aria-label="Una menos"
              onClick={() => onCambiarCantidad(carta.cantidad - 1)}
            >
              −
            </button>
            <span className="cantidad">{carta.cantidad}</span>
            <button
              className="mini"
              aria-label="Una más"
              onClick={() => onCambiarCantidad(carta.cantidad + 1)}
            >
              +
            </button>
          </>
        )}
        <button className="mini" aria-label="Quitar del mazo" onClick={onQuitar}>
          ×
        </button>
      </span>
    </li>
  );
}

export default FilaCarta;