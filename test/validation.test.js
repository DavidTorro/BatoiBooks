// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import Controller from '../src/controller/controller.class.js'

const API_URL = 'http://localhost:3000'
const html = readFileSync('index.html', 'utf8')
const formPage = html.match(/<template id="page-template">([\s\S]*?)<\/template>/)[1]
const initialDB = {
  modules: [
    { code: '5021', cliteral: 'Ciberseguridad' },
    { code: '5025', cliteral: 'Hacking ético' },
    { code: '5027', cliteral: 'Redes' },
  ],
  books: [
    { id: 1, userId: 2, moduleCode: '5021', publisher: 'Apunts', price: 12, pages: 25, status: 'good', photo: '', comments: '', soldDate: '' },
    { id: 2, userId: 2, moduleCode: '5027', publisher: 'Anaya', price: 20, pages: 40, status: 'new', photo: '', comments: '', soldDate: '' },
    { id: 3, userId: 3, moduleCode: '5025', publisher: 'McGraw-Hill', price: 30, pages: 60, status: 'used', photo: '', comments: '', soldDate: '' },
  ],
}

let db
let writes
let controller
let form

const server = setupServer(
  http.get(`${API_URL}/modules`, () => HttpResponse.json(db.modules)),
  http.get(`${API_URL}/books`, ({ request }) => {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const moduleCode = searchParams.get('moduleCode')
    return HttpResponse.json(db.books.filter((book) =>
      (userId === null || String(book.userId) === userId) &&
      (moduleCode === null || book.moduleCode === moduleCode)
    ))
  }),
  http.post(`${API_URL}/books`, async ({ request }) => {
    writes += 1
    const book = { ...(await request.json()), id: 4 }
    db.books.push(book)
    return HttpResponse.json(book, { status: 201 })
  }),
  http.put(`${API_URL}/books/:id`, async ({ params, request }) => {
    writes += 1
    const book = await request.json()
    db.books[db.books.findIndex((item) => item.id === Number(params.id))] = book
    return HttpResponse.json(book)
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

beforeEach(async () => {
  db = structuredClone(initialDB)
  writes = 0
  document.body.innerHTML = formPage
  controller = new Controller()
  form = document.querySelector('#book-form')
  expect(await controller.init()).toBe(true)
})

function error(name) {
  return document.getElementById(`${name}-error`).textContent
}

function submit() {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
}

async function selectModule(code) {
  const select = form.elements.moduleCode
  select.value = code
  select.dispatchEvent(new Event('change', { bubbles: true }))
  if (code) await vi.waitFor(() => expect(form.querySelector('[type="submit"]').disabled).toBe(false))
}

function fillOtherFields() {
  form.elements.publisher.value = 'Apunts'
  form.elements.publisher.dispatchEvent(new Event('input', { bubbles: true }))
  form.elements.price.value = '12.50'
  form.elements.price.dispatchEvent(new Event('input', { bubbles: true }))
  form.elements.pages.value = '40'
  form.elements.pages.dispatchEvent(new Event('input', { bubbles: true }))
  form.querySelector('#status-new').click()
}

describe('Validación del formulario', () => {
  test('muestra todos los errores y no envía datos inválidos', async () => {
    submit()
    for (const name of ['moduleCode', 'publisher', 'price', 'pages', 'status']) {
      expect(error(name)).not.toBe('')
    }
    expect(writes).toBe(0)

    await selectModule('5025')
    fillOtherFields()
    for (const name of ['moduleCode', 'publisher', 'price', 'pages', 'status']) {
      expect(error(name)).toBe('')
    }
    submit()
    await vi.waitFor(() => expect(writes).toBe(1))
    expect(db.books[3]).toMatchObject({ userId: 2, moduleCode: '5025', price: 12.5, pages: 40 })
  })

  test('distingue vacío, negativo y decimales en los números', () => {
    submit()
    expect(error('price')).toMatch(/obligatorio/)

    form.elements.price.value = '-1'
    form.elements.price.dispatchEvent(new Event('input', { bubbles: true }))
    expect(error('price')).toMatch(/negativo/)

    form.elements.price.value = '3.555'
    form.elements.price.dispatchEvent(new Event('input', { bubbles: true }))
    expect(error('price')).toMatch(/decimales/)

    form.elements.price.value = '3.50'
    form.elements.price.dispatchEvent(new Event('input', { bubbles: true }))
    expect(error('price')).toBe('')

    form.elements.pages.value = '3.5'
    form.elements.pages.dispatchEvent(new Event('input', { bubbles: true }))
    expect(error('pages')).toMatch(/entero/)

    form.elements.publisher.value = '   '
    form.elements.publisher.dispatchEvent(new Event('input', { bubbles: true }))
    expect(error('publisher')).toMatch(/obligatoria/)
    expect(writes).toBe(0)
  })

  test('comprueba el módulo al cambiarlo y sólo muestra su error', async () => {
    await selectModule('5021')
    expect(error('moduleCode')).toMatch(/repetido/)
    for (const name of ['publisher', 'price', 'pages', 'status']) expect(error(name)).toBe('')

    fillOtherFields()
    submit()
    expect(writes).toBe(0)

    await selectModule('5025')
    expect(error('moduleCode')).toBe('')
    submit()
    await vi.waitFor(() => expect(writes).toBe(1))
  })

  test('editar permite conservar el módulo propio y bloquea otro duplicado', async () => {
    document.querySelector('[data-book-id="1"] [data-action="edit"]').click()
    await selectModule('5027')
    expect(error('moduleCode')).toMatch(/repetido/)
    submit()
    expect(writes).toBe(0)

    await selectModule('5021')
    expect(error('moduleCode')).toBe('')
    form.elements.publisher.value = 'Nueva editorial'
    submit()
    await vi.waitFor(() => expect(writes).toBe(1))
    expect(db.books[0]).toMatchObject({ userId: 2, moduleCode: '5021', publisher: 'Nueva editorial' })
  })

  test('un fallo de red informa al usuario sin marcar el módulo como repetido', async () => {
    server.use(http.get(`${API_URL}/books`, () => HttpResponse.json({}, { status: 500 })))

    await selectModule('5025')
    expect(error('moduleCode')).toBe('')
    expect(document.querySelector('.alert-error').textContent).toMatch(/No se pudo comprobar/)
  })

  test('Reset, Añadir y Editar eliminan los errores anteriores', async () => {
    submit()
    expect(error('publisher')).not.toBe('')
    form.querySelector('[type="reset"]').click()
    for (const name of ['moduleCode', 'publisher', 'price', 'pages', 'status']) {
      expect(error(name)).toBe('')
    }

    await selectModule('5021')
    expect(error('moduleCode')).toMatch(/repetido/)
    document.querySelector('[data-book-id="1"] [data-action="edit"]').click()
    expect(error('moduleCode')).toBe('')
    expect(form.elements.moduleCode.checkValidity()).toBe(true)

    await selectModule('5027')
    expect(error('moduleCode')).toMatch(/repetido/)
    controller.view.resetBookForm()
    expect(error('moduleCode')).toBe('')
    expect(form.elements.moduleCode.value).toBe('')
    expect(form.querySelector('[type="submit"]').disabled).toBe(false)
  })

  test('ignora respuestas antiguas al cambiar de módulo o hacer Reset', async () => {
    let resolveFirst
    let resolveSecond
    const first = new Promise((resolve) => { resolveFirst = resolve })
    const second = new Promise((resolve) => { resolveSecond = resolve })
    const lookup = vi.spyOn(controller.books, 'bookExists')
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second)

    form.elements.moduleCode.value = '5021'
    form.elements.moduleCode.dispatchEvent(new Event('change', { bubbles: true }))
    expect(form.querySelector('[type="submit"]').disabled).toBe(true)
    submit()
    expect(writes).toBe(0)

    form.elements.moduleCode.value = '5025'
    form.elements.moduleCode.dispatchEvent(new Event('change', { bubbles: true }))
    resolveSecond(false)
    await vi.waitFor(() => expect(form.querySelector('[type="submit"]').disabled).toBe(false))
    resolveFirst(true)
    await first
    expect(error('moduleCode')).toBe('')

    const third = new Promise((resolve) => { resolveFirst = resolve })
    lookup.mockReturnValueOnce(third)
    form.elements.moduleCode.value = '5021'
    form.elements.moduleCode.dispatchEvent(new Event('change', { bubbles: true }))
    form.querySelector('[type="reset"]').click()
    resolveFirst(true)
    await third
    expect(error('moduleCode')).toBe('')
    expect(form.querySelector('[type="submit"]').disabled).toBe(false)
  })
})
