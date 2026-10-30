// @vitest-environment jsdom
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import Controller from '../src/controller/controller.class.js'

const API_URL = 'http://localhost:3000'
const initialDB = {
  users: [{ id: 2, nick: 'Ignasi', email: 'ignasi@example.com', password: '1234' }],
  modules: [{ code: '5021', cliteral: 'Incidentes de ciberseguridad', vliteral: 'Incidents', courseId: '59' }],
  books: [
    { id: 1, userId: 2, moduleCode: '5021', publisher: 'Apunts', price: 12, pages: 25, status: 'good', photo: '', comments: '', soldDate: '' },
    { id: 2, userId: 2, moduleCode: '5021', publisher: 'McGraw-Hill', price: 30, pages: 100, status: 'new', photo: '', comments: '', soldDate: '' },
  ],
}

let db

const server = setupServer(
  http.get(`${API_URL}/users`, () => HttpResponse.json(db.users)),
  http.get(`${API_URL}/modules`, () => HttpResponse.json(db.modules)),
  http.get(`${API_URL}/books`, () => HttpResponse.json(db.books)),
  http.post(`${API_URL}/books`, async ({ request }) => {
    const book = { ...(await request.json()), id: 3 }
    db.books.push(book)
    return HttpResponse.json(book, { status: 201 })
  }),
  http.delete(`${API_URL}/books/:id`, ({ params }) => {
    db.books = db.books.filter((book) => book.id !== Number(params.id))
    return HttpResponse.json({})
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  db = structuredClone(initialDB)
  document.body.innerHTML = `
    <div id="messages"></div>
    <div id="list"></div>
    <div id="remove">
      <input id="remove-book-id" type="number">
      <button id="remove-book-button" type="button">Borrar</button>
    </div>
    <div id="form">
      <form id="book-form">
        <select id="userId" name="userId" required></select>
        <select id="moduleCode" name="moduleCode" required></select>
        <input id="publisher" name="publisher" required>
        <input id="price" name="price" type="number" required>
        <input id="pages" name="pages" type="number" required>
        <input id="status-new" name="status" type="radio" value="new" required>
        <input id="photo" name="photo">
        <textarea id="comments" name="comments"></textarea>
        <input id="soldDate" name="soldDate" type="date">
        <button type="submit">Guardar</button>
      </form>
    </div>
    <div id="about"></div>
  `
})

describe('Controlador', () => {
  test('init carga los datos y pide a la vista que los muestre', async () => {
    const controller = new Controller()
    const renderUsers = vi.spyOn(controller.view, 'renderUsers')
    const renderModules = vi.spyOn(controller.view, 'renderModules')
    const renderBooks = vi.spyOn(controller.view, 'renderBooks')

    expect(await controller.init()).toBe(true)
    expect(controller.users.data).toHaveLength(1)
    expect(controller.modules.data).toHaveLength(1)
    expect(controller.books.data).toHaveLength(2)
    expect(renderUsers).toHaveBeenCalledWith(controller.users.data)
    expect(renderModules).toHaveBeenCalledWith(controller.modules.data)
    expect(renderBooks).toHaveBeenCalledWith(controller.books.data, controller.modules.data)
    expect(document.querySelectorAll('.card')).toHaveLength(2)
  })

  test('el envío guarda el libro, actualiza la vista y restablece el formulario', async () => {
    const controller = new Controller()
    await controller.init()
    const form = document.querySelector('#book-form')

    form.querySelector('#userId').value = '2'
    form.querySelector('#moduleCode').value = '5021'
    form.querySelector('#publisher').value = 'Apunts'
    form.querySelector('#price').value = '15'
    form.querySelector('#pages').value = '40'
    form.querySelector('#status-new').checked = true
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(document.querySelectorAll('.card')).toHaveLength(3))
    expect(db.books[2]).toMatchObject({ userId: 2, price: 15, pages: 40, status: 'new' })
    expect(document.querySelectorAll('.card')).toHaveLength(3)
    expect(form.querySelector('#publisher').value).toBe('')
    expect(document.querySelector('.alert-info').textContent).toContain('Libro añadido')
  })

  test('el borrado actualiza el listado y limpia la ID', async () => {
    const controller = new Controller()
    await controller.init()
    const input = document.querySelector('#remove-book-id')

    input.value = '1'
    document.querySelector('#remove-book-button').click()

    await vi.waitFor(() => expect(document.querySelectorAll('.card')).toHaveLength(1))
    expect(controller.books.data).toHaveLength(1)
    expect(document.querySelectorAll('.card')).toHaveLength(1)
    expect(document.querySelector('[data-book-id="1"]')).toBeNull()
    expect(input.value).toBe('')
    expect(document.querySelector('.alert-info').textContent).toContain('Libro eliminado')
  })

  test('los errores de carga se muestran sin confirmación de éxito', async () => {
    server.use(
      http.get(`${API_URL}/books`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      )
    )
    const controller = new Controller()

    expect(await controller.init()).toBe(false)
    expect(document.querySelector('.alert-error').textContent).toContain('Error cargando los datos')
    expect(document.querySelector('.alert-info')).toBeNull()
    expect(document.querySelectorAll('.card')).toHaveLength(0)
  })

  test('un alta o borrado fallido conserva el listado y no confirma éxito', async () => {
    const controller = new Controller()
    await controller.init()
    server.use(
      http.post(`${API_URL}/books`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      ),
      http.delete(`${API_URL}/books/:id`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      )
    )

    expect(await controller.handleSubmitBook({ publisher: 'Apunts' })).toBeNull()
    expect(await controller.handleRemoveBook(1)).toBe(false)
    expect(controller.books.data).toHaveLength(2)
    expect(document.querySelectorAll('.card')).toHaveLength(2)
    expect(document.querySelectorAll('.alert-error')).toHaveLength(2)
    expect(document.querySelector('.alert-info')).toBeNull()
  })
})
