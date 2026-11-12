function TarjetaCarta({ carta, textoBoton, deshabilitado, onAccion }) {
  return (
    <div className="tarjeta-carta">
      {carta.imagen ? (
        <img src={carta.imagen} alt={carta.nombre} loading="lazy" />
      ) : (
        <div className="sin-imagen">{carta.nombre}</div>
      )}
      <p className="nombre-carta">{carta.nombre}</p>
      {textoBoton && (
        <button className="secundario" disabled={deshabilitado} onClick={onAccion}>
          {textoBoton}
        </button>
      )}
    </div>
  );
}

export default TarjetaCarta;