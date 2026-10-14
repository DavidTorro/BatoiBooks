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
    books.incrementPriceOfbooks(0.1)
    expect(books.data[0].price).toBe(13.2)
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

describe('Métodos de texto', () => {
  test('los objetos convierten sus datos a texto JSON', () => {
    const book = new Book(data.books[0])
    const user = new User(1, 'Ana', 'ana@example.com', '1234')
    const module = new Module('5021', 'Seguridad', 'Seguretat', '59')

    expect(JSON.parse(book.toString())).toEqual(data.books[0])
    expect(JSON.parse(user.toString())).toEqual({
      id: 1,
      nick: 'Ana',
      email: 'ana@example.com',
      password: '1234',
    })
    expect(JSON.parse(module.toString())).toEqual({
      code: '5021',
      cliteral: 'Seguridad',
      vliteral: 'Seguretat',
      courseId: '59',
    })
  })

  test('las colecciones convierten sus elementos a texto', () => {
    const books = new Books()
    const users = new Users()
    const modules = new Modules()

    books.populate(data.books)
    users.populate(data.users)
    modules.populate(data.modules)

    expect(books.toString()).toContain('"id":1')
    expect(users.toString()).toContain('"nick":"Ignasi"')
    expect(modules.toString()).toContain('"code":"0011"')
  })
})

describe('Consultas de Books', () => {
  function createBooks() {
    const books = new Books()
    books.populate(data.books)
    return books
  }

  test('busca libros por id e índice y lanza error cuando no existen', () => {
    const books = createBooks()

    expect(books.getBookById(6).id).toBe(6)
    expect(books.getBookIndexById(6)).toBe(1)
    expect(() => books.getBookById(999)).toThrow('Libro no encontrado')
    expect(() => books.getBookIndexById(999)).toThrow('Libro no encontrado')
  })

  test('resuelve todas las consultas heredadas del ejercicio de arrays', () => {
    const books = createBooks()

    expect(books.bookExists(4, '5025')).toBe(true)
    expect(books.bookExists(2, '5021')).toBe(false)
    expect(books.booksFromUser(4)).toHaveLength(3)
    expect(books.booksFromModule('5021')).toHaveLength(3)
    expect(books.booksCheeperThan(15)).toHaveLength(4)
    expect(books.booksWithStatus('good')).toHaveLength(4)
    expect(books.averagePriceOfBooks()).toBe('26.17 €')
    expect(books.booksOfTypeNotes()).toHaveLength(3)
    expect(books.booksNotSold()).toHaveLength(5)
  })

  test('incrementa los precios de la misma colección sin crear otra', () => {
    const books = createBooks()
    const firstBook = books.data[0]

    expect(books.incrementPriceOfbooks(0.1)).toBeUndefined()
    expect(books.data[0]).toBe(firstBook)
    expect(books.data[0].price).toBe(13.2)
  })

  test('lanza errores al cambiar o eliminar libros inexistentes', () => {
    const books = createBooks()

    expect(() => books.changeBook({ id: 999 })).toThrow('Libro no encontrado')
    expect(() => books.removeBook(999)).toThrow('Libro no encontrado')
  })
})

describe('Consultas de Users y Modules', () => {
  test('busca usuarios por id, índice y nick, incluidos los errores', () => {
    const users = new Users()
    users.populate(data.users)

    expect(users.getUserById(3).nick).toBe('Juan')
    expect(users.getUserIndexById(4)).toBe(2)
    expect(users.getUserByNickName('Marta').id).toBe(4)
    expect(() => users.getUserById(999)).toThrow('Usuario no encontrado')
    expect(() => users.getUserIndexById(999)).toThrow('Usuario no encontrado')
    expect(() => users.getUserByNickName('Unknown')).toThrow(
      'Usuario no encontrado'
    )
  })

  test('lanza errores al cambiar o eliminar usuarios inexistentes', () => {
    const users = new Users()
    users.populate(data.users)

    expect(() => users.changeUser({ id: 999 })).toThrow('Usuario no encontrado')
    expect(() => users.removeUser(999)).toThrow('Usuario no encontrado')
  })

  test('populate no devuelve valores y genera instancias de las clases esperadas', () => {
    const books = new Books()
    const users = new Users()
    const modules = new Modules()

    expect(books.populate(data.books)).toBeUndefined()
    expect(users.populate(data.users)).toBeUndefined()
    expect(modules.populate(data.modules)).toBeUndefined()
    expect(books.data[0]).toBeInstanceOf(Book)
    expect(users.data[0]).toBeInstanceOf(User)
    expect(modules.data[0]).toBeInstanceOf(Module)
  })
})
