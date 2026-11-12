const URL_BUSQUEDA = 'https://api.scryfall.com/cards/search';

const pausa = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

async function consultar(consulta) {
  let respuesta;
  try {
    respuesta = await fetch(`${URL_BUSQUEDA}?q=${encodeURIComponent(consulta)}`);
  } catch {
    throw new Error('No se pudo conectar con Scryfall.');
  }

  if (respuesta.status === 404) return [];
  if (!respuesta.ok) throw new Error('Scryfall no pudo procesar la búsqueda.');

  const datos = await respuesta.json();
  return datos.data.slice(0, 20);
}

function claveDeCarta(carta) {
  return carta.oracle_id || carta.card_faces?.[0]?.oracle_id || carta.name;
}

export async function buscarCartas(texto) {
  const enIngles = await consultar(texto);
  await pausa(100);
  const enEspanol = await consultar(`lang:es ${texto}`);

  const vistas = new Set();
  const unicas = [];
  for (const carta of [...enIngles, ...enEspanol]) {
    const clave = claveDeCarta(carta);
    if (!vistas.has(clave)) {
      vistas.add(clave);
      unicas.push(carta);
    }
  }

  return unicas.map((carta) => ({
    scryfall_id: carta.id,
    nombre: carta.printed_name || carta.name,
    imagen:
      carta.image_uris?.normal ||
      carta.card_faces?.[0]?.image_uris?.normal ||
      '',
  }));
}