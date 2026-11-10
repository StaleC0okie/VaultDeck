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