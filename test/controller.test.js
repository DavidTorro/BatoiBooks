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
  http.put(`${API_URL}/books/:id`, async ({ params, request }) => {
    const book = await request.json()
    const index = db.books.findIndex((item) => item.id === Number(params.id))
    db.books[index] = book
    return HttpResponse.json(book)
  }),
  http.delete(`${API_URL}/books/:id`, ({ params }) => {
    db.books = db.books.filter((book) => book.id !== Number(params.id))
    return HttpResponse.json({})
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

beforeEach(() => {
  db = structuredClone(initialDB)
  document.body.innerHTML = `
    <div id="messages"></div>
    <div id="list"></div>
    <div id="form">
      <h2 id="form-heading">Añadir libro</h2>
      <form id="book-form">
        <div id="book-id-field" hidden><input id="bookId" name="id" type="text" disabled></div>
        <select id="moduleCode" name="moduleCode" required></select>
        <input id="publisher" name="publisher" required>
        <input id="price" name="price" type="number" required>
        <input id="pages" name="pages" type="number" required>
        <input id="status-new" name="status" type="radio" value="new" required>
        <input id="status-good" name="status" type="radio" value="good">
        <input id="status-used" name="status" type="radio" value="used">
        <input id="status-bad" name="status" type="radio" value="bad">
        <input id="status-digital" name="status" type="radio" value="digital">
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
    const populateCart = vi.spyOn(controller.cart, 'populate')
    const renderModules = vi.spyOn(controller.view, 'renderModules')
    const renderBooks = vi.spyOn(controller.view, 'renderBooks')

    expect(await controller.init()).toBe(true)
    expect(populateCart).toHaveBeenCalledOnce()
    expect(controller.cart.data).toEqual([])
    expect(controller.modules.data).toHaveLength(1)
    expect(controller.books.data).toHaveLength(2)
    expect(renderModules).toHaveBeenCalledWith(controller.modules.data)
    expect(renderBooks).toHaveBeenCalledWith(controller.books.data, controller.modules.data)
    expect(document.querySelectorAll('.card')).toHaveLength(2)
  })

  test('el envío guarda el libro, actualiza la vista y restablece el formulario', async () => {
    const controller = new Controller()
    await controller.init()
    const form = document.querySelector('#book-form')

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

  test('el carrito guarda una copia y avisa si el libro ya estaba', async () => {
    const controller = new Controller()
    await controller.init()
    const button = document.querySelector('[data-book-id="1"] [data-action="cart"]')

    button.click()
    expect(controller.cart.data).toHaveLength(1)
    expect(controller.cart.data[0]).not.toBe(controller.books.data[0])
    expect(document.querySelector('.alert-info').textContent).toContain('añadido al carrito')

    button.click()
    expect(controller.cart.data).toHaveLength(1)
    expect(document.querySelector('.alert-error').textContent).toContain('ya está en el carrito')
  })

  test('editar usa PUT, conserva el propietario y restablece el formulario', async () => {
    db.books[1].userId = 3
    const controller = new Controller()
    await controller.init()
    document.querySelector('[data-book-id="2"] [data-action="edit"]').click()
    const form = document.querySelector('#book-form')

    expect(document.querySelector('#form-heading').textContent).toBe('Editar libro')
    expect(form.querySelector('#bookId').value).toBe('2')
    expect(form.querySelector('#bookId').disabled).toBe(true)
    expect(form.querySelector('#publisher').value).toBe('McGraw-Hill')

    form.querySelector('#publisher').value = 'Anaya'
    form.querySelector('#price').value = '25'
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(db.books[1].publisher).toBe('Anaya'))
    expect(db.books[1]).toMatchObject({ id: 2, userId: 3, price: 25 })
    expect(document.querySelector('[data-book-id="2"]').textContent).toContain('Anaya')
    expect(document.querySelectorAll('.card')).toHaveLength(2)
    expect(document.querySelector('#form-heading').textContent).toBe('Añadir libro')
    expect(document.querySelector('#book-id-field').hidden).toBe(true)
    expect(document.querySelector('.alert-info').textContent).toContain('Libro actualizado')
  })

  test('el borrado pide confirmación con ID y módulo y actualiza el listado', async () => {
    const controller = new Controller()
    await controller.init()
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    const button = document.querySelector('[data-book-id="1"] [data-action="delete"]')
    document.querySelector('[data-book-id="1"] [data-action="edit"]').click()

    button.click()
    expect(document.querySelectorAll('.card')).toHaveLength(2)
    expect(db.books).toHaveLength(2)
    expect(document.querySelector('#form-heading').textContent).toBe('Editar libro')

    button.click()

    await vi.waitFor(() => expect(document.querySelectorAll('.card')).toHaveLength(1))
    expect(controller.books.data).toHaveLength(1)
    expect(document.querySelectorAll('.card')).toHaveLength(1)
    expect(document.querySelector('[data-book-id="1"]')).toBeNull()
    expect(document.querySelector('#form-heading').textContent).toBe('Añadir libro')
    expect(confirm).toHaveBeenCalledTimes(2)
    expect(confirm.mock.calls[0][0]).toContain('1')
    expect(confirm.mock.calls[0][0]).toContain('Incidentes de ciberseguridad')
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

    expect(await controller.handleSubmitProductForm({ publisher: 'Apunts' })).toBeNull()
    expect(await controller.handleRemoveBook(1)).toBe(false)
    expect(controller.books.data).toHaveLength(2)
    expect(document.querySelectorAll('.card')).toHaveLength(2)
    expect(document.querySelectorAll('.alert-error')).toHaveLength(2)
    expect(document.querySelector('.alert-info')).toBeNull()
  })

  test('una edición fallida conserva la tarjeta y los datos del formulario', async () => {
    const controller = new Controller()
    await controller.init()
    document.querySelector('[data-book-id="1"] [data-action="edit"]').click()
    document.querySelector('#publisher').value = 'Anaya'
    server.use(
      http.put(`${API_URL}/books/:id`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      )
    )

    document.querySelector('#book-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await vi.waitFor(() => expect(document.querySelector('.alert-error')).not.toBeNull())
    expect(db.books[0].publisher).toBe('Apunts')
    expect(controller.books.data[0].publisher).toBe('Apunts')
    expect(document.querySelector('[data-book-id="1"]').textContent).toContain('Apunts')
    expect(document.querySelector('#form-heading').textContent).toBe('Editar libro')
    expect(document.querySelector('#publisher').value).toBe('Anaya')
  })
})
