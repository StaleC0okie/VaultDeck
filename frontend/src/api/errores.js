export function mensajeDeError(err) {
  if (!err.response) {
    return 'No se pudo conectar con el servidor.';
  }
  const { status, data } = err.response;

  if (status === 400) {
    if (data.detail) return data.detail;
    return Object.entries(data)
      .map(([campo, mensajes]) => `${campo}: ${[].concat(mensajes).join(' ')}`)
      .join(' | ');
  }
  if (status === 401) return 'Tu sesión expiró. Vuelve a ingresar.';
  if (status === 404) return 'El recurso no existe o fue eliminado.';
  return 'Ocurrió un error inesperado en el servidor.';
}