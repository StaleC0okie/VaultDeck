import client from './client';

export async function listarMazos() {
  const respuesta = await client.get('/mazos/');
  return respuesta.data;
}

export async function crearMazo(datos) {
  const respuesta = await client.post('/mazos/', datos);
  return respuesta.data;
}

export async function actualizarMazo(id, datos) {
  const respuesta = await client.put(`/mazos/${id}/`, datos);
  return respuesta.data;
}

export async function eliminarMazo(id) {
  await client.delete(`/mazos/${id}/`);
}

export async function obtenerMazo(id) {
  const respuesta = await client.get(`/mazos/${id}/`);
  return respuesta.data;
}

export async function agregarCarta(mazoId, carta) {
  const respuesta = await client.post(`/mazos/${mazoId}/cartas/`, carta);
  return respuesta.data;
}

export async function quitarCarta(mazoId, cartaId) {
  await client.delete(`/mazos/${mazoId}/cartas/${cartaId}/`);
}