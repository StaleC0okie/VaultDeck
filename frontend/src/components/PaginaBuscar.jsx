
import { useState } from 'react';
import BuscadorCartas from './BuscadorCartas';

function PaginaBuscar() {
  const [cartaVista, setCartaVista] = useState(null);

  return (
    <section>
      <div className="cabecera-seccion">
        <h1>Buscar cartas</h1>
      </div>

      <div className="detalle-mazo">
        <div>
          <BuscadorCartas onVer={setCartaVista} />
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
        </aside>
      </div>
    </section>
  );
}

export default PaginaBuscar;
