import client from './client';

export async function login(username, password) {
  const respuesta = await client.post('/auth/login/', { username, password });
  localStorage.setItem('token', respuesta.data.access);
}

export async function registro(username, email, password, password2) {
  const respuesta = await client.post('/auth/registro/', {
    username,
    email,
    password,
    password2
  });

  return respuesta.data;
}

export function logout() {
  localStorage.removeItem('token');
}

export function haySesion() {
  return Boolean(localStorage.getItem('token'));
}
