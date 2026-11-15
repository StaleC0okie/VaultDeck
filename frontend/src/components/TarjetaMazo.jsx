
function TarjetaMazo({ mazo, onAbrir, onEditar, onEliminar }) {
  const totalCartas =
    mazo.cartas.reduce((total, carta) => total + carta.cantidad, 0) +
    (mazo.comandante_scryfall_id ? 1 : 0);

  return (
    <article className="tarjeta-mazo">
      {mazo.comandante_imagen && (
        <div
          className="fondo-comandante"
          style={{
            backgroundImage: `url("${mazo.comandante_imagen}")`
          }}
        />
      )}

      <div className="contenido-tarjeta-mazo">
        <h2>{mazo.nombre}</h2>

        <p className="meta">
          <span className="formato">{mazo.formato}</span> · {totalCartas} cartas
        </p>

        {mazo.descripcion && (
          <p className="apagado">{mazo.descripcion}</p>
        )}

        {mazo.comandante_nombre && (
          <p className="meta">
            Comandante: {mazo.comandante_nombre}
          </p>
        )}

        <div className="acciones">
          <button onClick={onAbrir}>Abrir</button>
          <button className="secundario" onClick={onEditar}>Editar</button>
          <button className="secundario" onClick={onEliminar}>Eliminar</button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaMazo;
