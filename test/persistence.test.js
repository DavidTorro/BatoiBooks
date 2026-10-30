import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  addDBBook,
  addDBUser,
  changeDBBook,
  changeDBUser,
  changeDBUserPassword,
  getDBBook,
  getDBBooks,
  getDBModules,
  getDBUser,
  getDBUsers,
  removeDBBook,
  removeDBUser,
} from '../src/services/api.js'
import Book from '../src/model/book.class.js'
import Books from '../src/model/books.class.js'
import Module from '../src/model/module.class.js'
import Modules from '../src/model/modules.class.js'
import User from '../src/model/user.class.js'
import Users from '../src/model/users.class.js'

const API_URL = 'http://localhost:3000'

const initialDB = {
  users: [
    { id: 2, nick: 'Ignasi', email: 'ignasi@example.com', password: '1234' },
    { id: 3, nick: 'Juan', email: 'juan@example.com', password: '1234' },
    { id: 4, nick: 'Marta', email: 'marta@example.com', password: '1234' },
    { id: 5, nick: 'Paco', email: 'paco@example.com', password: '1234' },
  ],
  modules: [
    {
      code: '5021',
      cliteral: 'Incidentes de ciberseguridad',
      vliteral: 'Incidents de ciberseguretat',
      courseId: '59',
    },
  ],
  books: [
    {
      id: 1,
      userId: 2,
      moduleCode: '5025',
      publisher: 'Apunts',
      price: 12,
      pages: 25,
      status: 'good',
      photo: '',
      comments: '',
      soldDate: '2023-02-01',
    },
    {
      id: 6,
      userId: 3,
      moduleCode: '5021',
      publisher: 'McGraw-Hill',
      price: 75,
      pages: 273,
      status: 'new',
      photo: '',
      comments: 'Sense obrir',
      soldDate: '',
    },
    {
      id: 7,
      userId: 4,
      moduleCode: '5021',
      publisher: 'McGraw-Hill',
      price: 15,
      pages: 173,
      status: 'bad',
      photo: '',
      comments: 'Fet pols',
      soldDate: '',
    },
  ],
}

let db

function copyInitialDB() {
  return JSON.parse(JSON.stringify(initialDB))
}

function findById(items, id) {
  return items.find((item) => item.id === Number(id))
}

const server = setupServer(
  http.get(`${API_URL}/users`, () => HttpResponse.json(db.users)),
  http.get(`${API_URL}/users/:id`, ({ params }) => {
    const user = findById(db.users, params.id)
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ message: 'Not found' }, { status: 404 })
  }),
  http.post(`${API_URL}/users`, async ({ request }) => {
    const user = { ...(await request.json()), id: 6 }
    db.users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),
  http.put(`${API_URL}/users/:id`, async ({ request, params }) => {
    const userIndex = db.users.findIndex((user) => user.id === Number(params.id))
    if (userIndex === -1) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const user = await request.json()
    db.users[userIndex] = user
    return HttpResponse.json(user)
  }),
  http.delete(`${API_URL}/users/:id`, ({ params }) => {
    db.users = db.users.filter((user) => user.id !== Number(params.id))
    return HttpResponse.json({})
  }),
  http.get(`${API_URL}/modules`, () => HttpResponse.json(db.modules)),
  http.get(`${API_URL}/books`, () => HttpResponse.json(db.books)),
  http.get(`${API_URL}/books/:id`, ({ params }) => {
    const book = findById(db.books, params.id)
    return book
      ? HttpResponse.json(book)
      : HttpResponse.json({ message: 'Not found' }, { status: 404 })
  }),
  http.post(`${API_URL}/books`, async ({ request }) => {
    const book = { ...(await request.json()), id: 11 }
    db.books.push(book)
    return HttpResponse.json(book, { status: 201 })
  }),
  http.put(`${API_URL}/books/:id`, async ({ request, params }) => {
    const bookIndex = db.books.findIndex((book) => book.id === Number(params.id))
    if (bookIndex === -1) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const book = await request.json()
    db.books[bookIndex] = book
    return HttpResponse.json(book)
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
  db = copyInitialDB()
})

describe('Servicios de persistencia', () => {
  test('obtienen usuarios, módulos y libros desde la API', async () => {
    await expect(getDBUsers()).resolves.toHaveLength(4)
    await expect(getDBModules()).resolves.toEqual(initialDB.modules)
    await expect(getDBBooks()).resolves.toHaveLength(3)
    await expect(getDBUser(3)).resolves.toMatchObject({ nick: 'Juan' })
    await expect(getDBBook(6)).resolves.toMatchObject({ price: 75 })
  })

  test('persisten altas, cambios y bajas de libros', async () => {
    const newBook = await addDBBook({
      userId: 2,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 20,
      pages: 50,
      status: 'new',
    })

    expect(newBook.id).toBe(11)
    await expect(changeDBBook({ ...newBook, price: 25 })).resolves.toMatchObject({
      price: 25,
    })
    await removeDBBook(newBook.id)
    expect(db.books).not.toContainEqual(expect.objectContaining({ id: 11 }))
  })

  test('persisten altas, cambios, bajas y contraseñas de usuarios', async () => {
    const newUser = await addDBUser({
      nick: 'Ana',
      email: 'ana@example.com',
      password: '1234',
    })

    await expect(changeDBUser({ ...newUser, nick: 'Ana María' })).resolves.toMatchObject({
      nick: 'Ana María',
    })
    await expect(changeDBUserPassword(2, 'secreta')).resolves.toMatchObject({
      nick: 'Ignasi',
      password: 'secreta',
    })
    await removeDBUser(newUser.id)
    expect(db.users).not.toContainEqual(expect.objectContaining({ id: 6 }))
  })

  test('propagan los errores HTTP de la API', async () => {
    await expect(getDBBook(999)).rejects.toThrow('Error en la petición: 404')
  })
})

describe('Colecciones persistentes', () => {
  test('populate carga instancias desde la API sin recibir parámetros', async () => {
    const books = new Books()
    const users = new Users()
    const modules = new Modules()

    await Promise.all([books.populate(), users.populate(), modules.populate()])

    expect(books.data[0]).toBeInstanceOf(Book)
    expect(users.data[0]).toBeInstanceOf(User)
    expect(modules.data[0]).toBeInstanceOf(Module)
    expect(modules.getModuleByCode('5021').cliteral).toBe(
      'Incidentes de ciberseguridad'
    )
  })

  test('Books actualiza data solo después de persistir los cambios', async () => {
    const books = new Books()
    await books.populate()

    const newBook = await books.addBook({
      userId: 2,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 20,
      pages: 50,
      status: 'new',
    })
    expect(newBook.id).toBe(11)
    expect(books.data).toContain(newBook)

    await books.changeBook({ ...newBook, price: 25 })
    expect(books.getBookById(11).price).toBe(25)

    await books.removeBook(11)
    expect(() => books.getBookById(11)).toThrow('Libro no encontrado')
  })

  test('no modifica data si la API rechaza una operación', async () => {
    const books = new Books()
    await books.populate()
    server.use(
      http.delete(`${API_URL}/books/1`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      )
    )

    await expect(books.removeBook(1)).rejects.toThrow('Error en la petición: 500')
    expect(books.getBookById(1)).toBeInstanceOf(Book)
  })

  test('Users actualiza data y permite cambiar una contraseña', async () => {
    const users = new Users()
    await users.populate()

    const newUser = await users.addUser({
      nick: 'Ana',
      email: 'ana@example.com',
      password: '1234',
    })
    await users.changeUser({ ...newUser, nick: 'Ana María' })
    expect(users.getUserByNickName('Ana María').id).toBe(6)

    await users.changeUserPassword(2, 'secreta')
    expect((await users.getUserById(2)).password).toBe('secreta')

    await users.removeUser(6)
    await expect(users.getUserById(6)).rejects.toThrow('Error en la petición: 404')
  })

  test('getUserById consulta la API sin populate y rechaza usuarios inexistentes', async () => {
    const users = new Users()

    await expect(users.getUserById(2)).resolves.toBeInstanceOf(User)
    await expect(users.getUserById(999)).rejects.toThrow('Error en la petición: 404')
    expect(users.data).toEqual([])
  })

  test('conserva las consultas locales y elimina el incremento de precios', async () => {
    const books = new Books()
    await books.populate()

    expect(books.booksFromModule('5021')).toHaveLength(2)
    expect(books.booksWithStatus('new')).toHaveLength(1)
    expect(books.averagePriceOfBooks()).toBe('34.00 €')
    expect(books.incrementPriceOfbooks).toBeUndefined()
  })
})
