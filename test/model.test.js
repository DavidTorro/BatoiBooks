import { describe, expect, test } from 'vitest'
import data from '../src/data/datos.js'
import Book from '../src/model/book.class.js'
import Books from '../src/model/books.class.js'
import Module from '../src/model/module.class.js'
import Modules from '../src/model/modules.class.js'
import User from '../src/model/user.class.js'
import Users from '../src/model/users.class.js'

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

    expect(book.photo).toBe('')
    expect(book.comments).toBe('')
    expect(book.soldDate).toBe('')
  })

  test('User y Module guardan los datos recibidos', () => {
    const user = new User(1, 'Ana', 'ana@example.com', '1234')
    const module = new Module('5021', 'Seguridad', 'Seguretat', '59')

    expect(user.nick).toBe('Ana')
    expect(module.code).toBe('5021')
  })
})

describe('Books', () => {
  test('populate convierte los datos en objetos Book', () => {
    const books = new Books()
    books.populate(data.books)

    expect(books.data).toHaveLength(6)
    expect(books.data[0]).toBeInstanceOf(Book)
  })

  test('añade, modifica y elimina un libro', () => {
    const books = new Books()
    books.populate(data.books)

    const book = books.addBook({
      userId: 2,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 20,
      pages: 50,
      status: 'new',
    })

    expect(book.id).toBe(11)

    const changedBook = books.changeBook({ ...book, price: 25 })
    expect(changedBook.price).toBe(25)

    books.removeBook(book.id)
    expect(() => books.getBookById(book.id)).toThrow('Libro no encontrado')
  })

  test('mantiene las consultas del ejercicio anterior', () => {
    const books = new Books()
    books.populate(data.books)

    expect(books.booksFromModule('5021')).toHaveLength(3)
    expect(books.booksWithStatus('new')).toHaveLength(1)
    expect(books.incrementPriceOfbooks(0.1)[0].price).toBe(13.2)
  })
})

describe('Users y Modules', () => {
  test('Users añade, cambia y elimina usuarios', () => {
    const users = new Users()
    users.populate(data.users)

    const user = users.addUser({
      nick: 'Ana',
      email: 'ana@example.com',
      password: '1234',
    })

    expect(user.id).toBe(6)
    expect(users.changeUser({ ...user, nick: 'Ana María' }).nick).toBe(
      'Ana María'
    )

    users.removeUser(user.id)
    expect(() => users.getUserById(user.id)).toThrow('Usuario no encontrado')
  })

  test('Modules busca módulos por código', () => {
    const modules = new Modules()
    modules.populate(data.modules)

    expect(modules.getModuleByCode('5021').cliteral).toBe(
      'Incidentes de ciberseguridad'
    )
    expect(() => modules.getModuleByCode('0000')).toThrow('Módulo no encontrado')
  })
})