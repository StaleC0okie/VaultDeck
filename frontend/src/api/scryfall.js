const URL_BUSQUEDA = 'https://api.scryfall.com/cards/search';
const MAX_RESULTADOS = 40;

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
  return datos.data;
}

function claveDeCarta(carta) {
  return carta.oracle_id || carta.card_faces?.[0]?.oracle_id || carta.name;
}

function relevancia(carta, texto) {
  const buscado = texto.toLowerCase();
  const nombres = [carta.name, carta.printed_name]
    .filter(Boolean)
    .map((nombre) => nombre.toLowerCase());
  if (nombres.includes(buscado)) return 0;
  if (nombres.some((nombre) => nombre.startsWith(buscado))) return 1;
  return 2;
}

function esTierraBasica(carta) {
  const tipo = carta.type_line || carta.card_faces?.[0]?.type_line || '';
  return tipo.includes('Basic');
}

export async function buscarCartas(texto, filtro = '') {
  const extra = filtro ? ` ${filtro}` : '';
  const enIngles = await consultar(`${texto}${extra}`);
  await pausa(100);
  const enEspanol = await consultar(`lang:es ${texto}${extra}`);

  const vistas = new Set();
  const unicas = [];
  for (const carta of [...enIngles, ...enEspanol]) {
    const clave = claveDeCarta(carta);
    if (!vistas.has(clave)) {
      vistas.add(clave);
      unicas.push(carta);
    }
  }

  unicas.sort((a, b) => relevancia(a, texto) - relevancia(b, texto));

  return unicas.slice(0, MAX_RESULTADOS).map((carta) => ({
    scryfall_id: carta.id,
    oracle_id: carta.oracle_id || carta.card_faces?.[0]?.oracle_id || '',
    nombre: carta.printed_name || carta.name,
    tipo: carta.type_line || carta.card_faces?.[0]?.type_line || 'Sin tipo',
    es_basica: esTierraBasica(carta),
    color_identity: carta.color_identity || [],
    imagen:
      carta.image_uris?.normal ||
      carta.card_faces?.[0]?.image_uris?.normal ||
      '',
  }));
}