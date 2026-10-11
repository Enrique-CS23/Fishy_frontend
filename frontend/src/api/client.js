
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';


export function guardarTokens({ accessToken, refreshToken }) {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

export function obtenerAccessToken() {
  return localStorage.getItem('accessToken');
}

export function obtenerRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function borrarTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function cerrarSesion() {
  borrarTokens();
  window.location.replace('/login');
}

export class ApiError extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

let refrescando = null;

function refrescarAccessToken() {
  refrescando ??= fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: obtenerRefreshToken() }),
  })
    .then(async (respuesta) => {
      if (!respuesta.ok) {
        throw new ApiError(respuesta.status, 'El servidor rechazó el refresh');
      }
      guardarTokens(await respuesta.json()); 
    })
    .finally(() => {
      refrescando = null;
    });
  return refrescando;
}

export async function api(ruta, { metodo = 'GET', datos, reintento = false } = {}) {
  const headers = {};
  if (datos) headers['Content-Type'] = 'application/json';

  const token = obtenerAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(API + ruta, {
      method: metodo,
      headers,
      body: datos ? JSON.stringify(datos) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor.');
  }


  const esLoginORefresh = ruta === '/auth/login' || ruta === '/auth/refresh';
  if (respuesta.status === 401 && !esLoginORefresh && !reintento) {
    try {
      await refrescarAccessToken();
    } catch (e) {

      if (e instanceof ApiError) cerrarSesion();
      throw new ApiError(401, 'Tu sesión expiró. Vuelve a iniciar sesión.');
    }
    return api(ruta, { metodo, datos, reintento: true });
  }

  const cuerpo = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = Array.isArray(cuerpo?.message)
      ? cuerpo.message.join('. ')
      : cuerpo?.message;
    throw new ApiError(respuesta.status, mensaje ?? `Error ${respuesta.status}`);
  }

  return cuerpo;
}