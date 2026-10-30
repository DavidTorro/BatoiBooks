import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import data from '../src/data/datos.js'
import Book from '../src/model/book.class.js'
import Books from '../src/model/books.class.js'
import Module from '../src/model/module.class.js'
import Modules from '../src/model/modules.class.js'
import User from '../src/model/user.class.js'
import Users from '../src/model/users.class.js'

const API_URL = 'http://localhost:3000'
let db

function resetDB() {
  db = JSON.parse(JSON.stringify(data))
}

function findById(items, id) {
  return items.find((item) => item.id === Number(id))
}

const server = setupServer(
  http.get(`${API_URL}/books`, () => HttpResponse.json(db.books)),
  http.post(`${API_URL}/books`, async ({ request }) => {
    const book = {
      ...(await request.json()),
      id: Math.max(...db.books.map((item) => item.id)) + 1,
    }
    db.books.push(book)
    return HttpResponse.json(book, { status: 201 })
  }),
  http.put(`${API_URL}/books/:id`, async ({ request, params }) => {
    const index = db.books.findIndex((book) => book.id === Number(params.id))
    if (index === -1) {
      return HttpResponse.json({}, { status: 404 })
    }

    const book = await request.json()
    db.books[index] = book
    return HttpResponse.json(book)
  }),
  http.delete(`${API_URL}/books/:id`, ({ params }) => {
    db.books = db.books.filter((book) => book.id !== Number(params.id))
    return HttpResponse.json({})
  }),
  http.get(`${API_URL}/users`, () => HttpResponse.json(db.users)),
  http.get(`${API_URL}/users/:id`, ({ params }) => {
    const user = findById(db.users, params.id)
    return user ? HttpResponse.json(user) : HttpResponse.json({}, { status: 404 })
  }),
  http.post(`${API_URL}/users`, async ({ request }) => {
    const user = {
      ...(await request.json()),
      id: Math.max(...db.users.map((item) => item.id)) + 1,
    }
    db.users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),
  http.put(`${API_URL}/users/:id`, async ({ request, params }) => {
    const index = db.users.findIndex((user) => user.id === Number(params.id))
    if (index === -1) {
      return HttpResponse.json({}, { status: 404 })
    }

    const user = await request.json()
    db.users[index] = user
    return HttpResponse.json(user)
  }),
  http.delete(`${API_URL}/users/:id`, ({ params }) => {
    db.users = db.users.filter((user) => user.id !== Number(params.id))
    return HttpResponse.json({})
  }),
  http.get(`${API_URL}/modules`, () => HttpResponse.json(db.modules))
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(resetDB)

describe('Clases de objeto', () => {
  test('Book usa cadenas vacías para los campos opcionales', () => {
    const book = new Book({
      id: 1,
      userId: 2,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 10,
      pages: 20,
      status: 'new',
    })

    expect(book).toMatchObject({ photo: '', comments: '', soldDate: '' })
  })

  test('User y Module guardan los datos recibidos', () => {
    expect(new User(1, 'Ana', 'ana@example.com', '1234').nick).toBe('Ana')
    expect(new Module('5021', 'Seguridad', 'Seguretat', '59').code).toBe('5021')
  })
})

describe('Books', () => {
  async function createBooks() {
    const books = new Books()
    await books.populate()
    return books
  }

  test('populate carga Book desde la API', async () => {
    const books = await createBooks()

    expect(books.data).toHaveLength(6)
    expect(books.data[0]).toBeInstanceOf(Book)
  })

  test('añade, modifica y elimina un libro persistiendo cada cambio', async () => {
    const books = await createBooks()
    const book = await books.addBook({
      userId: 2,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 20,
      pages: 50,
      status: 'new',
    })

    expect(book.id).toBe(11)
    expect((await books.changeBook({ ...book, price: 25 })).price).toBe(25)
    await books.removeBook(book.id)
    expect(() => books.getBookById(book.id)).toThrow('Libro no encontrado')
  })

  test('mantiene las consultas locales y elimina el incremento de precios', async () => {
    const books = await createBooks()

    expect(books.bookExists(4, '5025')).toBe(true)
    expect(books.booksFromModule('5021')).toHaveLength(3)
    expect(books.booksWithStatus('new')).toHaveLength(1)
    expect(books.averagePriceOfBooks()).toBe('26.17 €')
    expect(books.incrementPriceOfbooks).toBeUndefined()
  })

  test('rechaza cambios y borrados locales inexistentes', async () => {
    const books = await createBooks()

    await expect(books.changeBook({ id: 999 })).rejects.toThrow(
      'Libro no encontrado'
    )
    await expect(books.removeBook(999)).rejects.toThrow('Libro no encontrado')
  })
})

describe('Users y Modules', () => {
  test('Users carga, añade, cambia, borra y busca usuarios', async () => {
    const users = new Users()
    await users.populate()

    const user = await users.addUser({
      nick: 'Ana',
      email: 'ana@example.com',
      password: '1234',
    })
    expect(user.id).toBe(6)
    expect((await users.changeUser({ ...user, nick: 'Ana María' })).nick).toBe(
      'Ana María'
    )
    expect(users.getUserIndexById(4)).toBe(2)
    expect(users.getUserByNickName('Marta').id).toBe(4)

    await users.changeUserPassword(2, 'secreta')
    expect((await users.getUserById(2)).password).toBe('secreta')
    await users.removeUser(user.id)
    await expect(users.getUserById(user.id)).rejects.toThrow('Error en la petición: 404')
  })

  test('Users rechaza cambios y borrados locales inexistentes', async () => {
    const users = new Users()
    await users.populate()

    await expect(users.changeUser({ id: 999 })).rejects.toThrow(
      'Usuario no encontrado'
    )
    await expect(users.removeUser(999)).rejects.toThrow('Usuario no encontrado')
  })

  test('Modules carga Module desde la API y busca por código', async () => {
    const modules = new Modules()
    await modules.populate()

    expect(modules.data[0]).toBeInstanceOf(Module)
    expect(modules.getModuleByCode('5021').cliteral).toBe(
      'Incidentes de ciberseguridad'
    )
    expect(() => modules.getModuleByCode('0000')).toThrow('Módulo no encontrado')
  })
})

describe('Métodos de texto', () => {
  test('mantienen la representación JSON de objetos y colecciones', async () => {
    const books = new Books()
    const users = new Users()
    const modules = new Modules()
    await Promise.all([books.populate(), users.populate(), modules.populate()])

    expect(JSON.parse(new Book(data.books[0]).toString())).toEqual(data.books[0])
    expect(books.toString()).toContain('"id":1')
    expect(users.toString()).toContain('"nick":"Ignasi"')
    expect(modules.toString()).toContain('"code":"0011"')
  })
})
