import { describe, expect, test } from 'vitest'
import data from '../src/data/datos.js'
import { 
  getBookById, 
  getBookIndexById, 
  bookExists, 
  booksFromUser,
  booksFromModule,
  booksCheeperThan,
  booksWithStatus,
  averagePriceOfBooks,
  booksOfTypeNotes
} from '../src/functions.js'

describe('getBookById', () => {
  test('Devuelve el libro cuya id coincide', () => {
    const book = getBookById(data.books, 6)

    expect(book.id).toBe(6)
  })

  test('Lanza un error si no existe el libro', () => {
    expect(() => getBookById(data.books, 999)).toThrow('Libro no encontrado')
  })
})

describe('getBookIndexById', () => {
  test('Devuelve la posición del libro cuya id coincide', () => {
    const bookIndex = getBookIndexById(data.books, 6)

    expect(bookIndex).toBe(1)
  })

  test('Lanza un error si no existe el libro', () => {
    expect(() => getBookIndexById(data.books, 999)).toThrow(
      'Libro no encontrado'
    )
  })
})

describe('bookExists', () => {
  test('Devuelve true si el usuario tiene un libro del módulo', () => {
    const exists = bookExists(data.books, 4, '5025')

    expect(exists).toBe(true)
  })

  test('Devuelve false si el usuario no tiene un libro del módulo', () => {
    const exists = bookExists(data.books, 2, '5021')

    expect(exists).toBe(false)
  })
})

describe('booksFromUser', () => {
  test('Devuelve todos los libros de un usuario', () => {
    const books = booksFromUser(data.books, 4)

    expect(books).toHaveLength(3)
    expect(books.every((book) => book.userId === 4)).toBe(true)
  })

  test('Devuelve un array vacío si el usuario no tiene libros', () => {
    const books = booksFromUser(data.books, 999)

    expect(books).toEqual([])
  })
})

describe('booksFromModule', () => {
  test('Devuelve todos los libros de un módulo', () => {
    const books = booksFromModule(data.books, '5021')

    expect(books).toHaveLength(3)
    expect(books.every((book) => book.moduleCode === '5021')).toBe(true)
  })

  test('Devuelve un array vacío si el módulo no tiene libros', () => {
    const books = booksFromModule(data.books, '0000')

    expect(books).toEqual([])
  })
})

describe('booksCheeperThan', () => {
  test('Devuelve libros con precio inferior o igual al indicado', () => {
    const books = booksCheeperThan(data.books, 15)

    expect(books).toHaveLength(4)
    expect(books.every((book) => book.price <= 15)).toBe(true)
  })

  test('Devuelve un array vacío si no hay libros con ese precio', () => {
    const books = booksCheeperThan(data.books, 0)

    expect(books).toEqual([])
  })
})

describe('booksWithStatus', () => {
  test('Devuelve todos los libros con el estado indicado', () => {
    const books = booksWithStatus(data.books, 'good')

    expect(books).toHaveLength(4)
    expect(books.every((book) => book.status === 'good')).toBe(true)
  })

  test('Devuelve un array vacío si no existe ese estado', () => {
    const books = booksWithStatus(data.books, 'unknown')

    expect(books).toEqual([])
  })
})

describe('averagePriceOfBooks', () => {
  test('Devuelve el precio medio con dos decimales y el símbolo euro', () => {
    const averagePrice = averagePriceOfBooks(data.books)

    expect(averagePrice).toBe('26.17 €')
  })
})

describe('booksOfTypeNotes', () => {
  test('Devuelve todos los libros que son apuntes', () => {
    const books = booksOfTypeNotes(data.books)

    expect(books).toHaveLength(3)
    expect(books.every((book) => book.publisher === 'Apunts')).toBe(true)
  })

  test('Devuelve un array vacío si no hay apuntes', () => {
    const books = booksOfTypeNotes(
      data.books.filter((book) => book.publisher !== 'Apunts')
    )

    expect(books).toEqual([])
  })
})