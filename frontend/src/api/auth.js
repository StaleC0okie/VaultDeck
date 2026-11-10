import client from './client';

export async function login(username, password) {
  const respuesta = await client.post('/auth/login/', { username, password });
  localStorage.setItem('token', respuesta.data.access);
}

export function logout() {
  localStorage.removeItem('token');
}

export function haySesion() {
  return Boolean(localStorage.getItem('token'));
}