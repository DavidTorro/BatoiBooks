const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Convierto cualquier respuesta HTTP no satisfactoria en una excepción
async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options)

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined
  }

  return response.json()
}

// Construye las opciones comunes de las peticiones que envían un objeto JSON.
function sendJSON(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

// Usuarios
export function getDBUsers() {
  return request('/users')
}

export function getDBUser(userId) {
  return request(`/users/${userId}`)
}

export function addDBUser(user) {
  return request('/users', sendJSON('POST', user))
}

export function removeDBUser(userId) {
  return request(`/users/${userId}`, { method: 'DELETE' })
}

export function changeDBUser(user) {
  return request(`/users/${user.id}`, sendJSON('PUT', user))
}

// Primero obtiene el usuario completo para que el PUT no elimine sus otros campos.
export async function changeDBUserPassword(userId, password) {
  const user = await getDBUser(userId)

  return changeDBUser({ ...user, password })
}

// Módulos
export function getDBModules() {
  return request('/modules')
}

// Libros
export function getDBBooks() {
  return request('/books')
}

export function getDBBook(bookId) {
  return request(`/books/${bookId}`)
}

export function addDBBook(book) {
  return request('/books', sendJSON('POST', book))
}

export function removeDBBook(bookId) {
  return request(`/books/${bookId}`, { method: 'DELETE' })
}

export function changeDBBook(book) {
  return request(`/books/${book.id}`, sendJSON('PUT', book))
}
