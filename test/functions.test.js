import { describe, expect, test } from 'vitest'
import data from '../src/data/datos.js'
import { 
  getBookById, 
  getBookIndexById, 
  bookExists, 
  booksFromUser
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