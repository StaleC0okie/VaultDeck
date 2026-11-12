import { useEffect, useState } from 'react';
import { actualizarMazo, crearMazo, eliminarMazo, listarMazos } from '../api/mazos';
import { mensajeDeError } from '../api/errores';
import FormularioMazo from './FormularioMazo';
import TarjetaMazo from './TarjetaMazo';
import DetalleMazo from './DetalleMazo';

function ListaMazos() {
  const [mazos, setMazos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mazoEditando, setMazoEditando] = useState(null);
  const [mazoAbiertoId, setMazoAbiertoId] = useState(null);

  async function cargarMazos() {
    setCargando(true);
    setError('');
    try {
      setMazos(await listarMazos());
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarMazos();
  }, []);

  function abrirCrear() {
    setMazoEditando(null);
    setMostrarForm(true);
  }

  function abrirEditar(mazo) {
    setMazoEditando(mazo);
    setMostrarForm(true);
  }

  async function guardar(datos) {
    if (mazoEditando) {
      const actualizado = await actualizarMazo(mazoEditando.id, datos);
      setMazos(mazos.map((m) => (m.id === actualizado.id ? actualizado : m)));
    } else {
      const nuevo = await crearMazo(datos);
      setMazos([nuevo, ...mazos]);
    }
    setMostrarForm(false);
  }

  async function eliminar(mazo) {
    if (!window.confirm(`¿Eliminar el mazo "${mazo.nombre}"?`)) return;
    try {
      await eliminarMazo(mazo.id);
      setMazos(mazos.filter((m) => m.id !== mazo.id));
    } catch (err) {
      setError(mensajeDeError(err));
    }
  }

   if (mazoAbiertoId) {
     return (
       <DetalleMazo
         mazoId={mazoAbiertoId}
         onVolver={() => {
           setMazoAbiertoId(null);
           cargarMazos();
         }}
       />
     );
   }  

  return (
    <section>
      <div className="cabecera-seccion">
        <h1>Mis mazos</h1>
        {!mostrarForm && <button onClick={abrirCrear}>Nuevo mazo</button>}
      </div>

      {mostrarForm && (
        <FormularioMazo
          key={mazoEditando?.id ?? 'nuevo'}
          mazo={mazoEditando}
          onGuardar={guardar}
          onCancelar={() => setMostrarForm(false)}
        />
      )}

      {error && (
        <div className="aviso-error">
          <span>{error}</span>
          <button className="secundario" onClick={cargarMazos}>Reintentar</button>
        </div>
      )}

      {cargando && <p className="apagado">Cargando mazos...</p>}

      {!cargando && !error && mazos.length === 0 && (
        <p className="apagado">Aún no tienes mazos. Crea el primero.</p>
      )}

      <div className="grid-mazos">
        {mazos.map((mazo) => (
          <TarjetaMazo
            key={mazo.id}
            mazo={mazo}
            onEditar={() => abrirEditar(mazo)}
            onEliminar={() => eliminar(mazo)}
            onAbrir={() => setMazoAbiertoId(mazo.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default ListaMazos;