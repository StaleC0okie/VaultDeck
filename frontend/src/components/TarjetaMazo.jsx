function TarjetaMazo({ mazo, onEditar, onEliminar }) {
  const totalCartas = mazo.cartas.reduce((total, carta) => total + carta.cantidad, 0);

  return (
    <article className="tarjeta-mazo">
      <h2>{mazo.nombre}</h2>
      <p className="meta">{mazo.formato} · {totalCartas} cartas</p>
      {mazo.descripcion && <p className="apagado">{mazo.descripcion}</p>}
      <div className="acciones">
        <button className="secundario" onClick={onEditar}>Editar</button>
        <button className="secundario" onClick={onEliminar}>Eliminar</button>
      </div>
    </article>
  );
}

export default TarjetaMazo;